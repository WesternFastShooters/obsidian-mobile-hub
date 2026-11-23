import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { createPortal } from "preact/compat";
import { App, TFile, Notice } from "obsidian";
import { DiaryItem, HubRuntimeState, MobileHubSettings } from "../types";
import {
  cleanMarkdownPreview,
  ensureFolder,
  extractImagesFromContent,
  getMarkdownFilesInFolder,
  getUniqueFilePath,
  openFileInEditor,
  pad2,
  resolveDiaryDateTime,
} from "../utils/obsidian";
import { CalendarPanel } from "../components/CalendarPanel";
import { ObsidianIcon } from "../components/ObsidianIcon";
import { BottomSheet } from "../components/BottomSheet";
import { PromptModal } from "../components/PromptModal";

interface DiaryTabProps {
  app: App;
  settings: MobileHubSettings;
  hubState: HubRuntimeState;
  refreshTick: number;
  onTrackDraft: (path: string) => void;
}

interface DiaryMeta {
  file: TFile;
  dateKey: string;
  timeText: string;
  sortKey: number;
}

export function DiaryTab({
  app,
  settings,
  hubState,
  refreshTick,
  onTrackDraft,
}: DiaryTabProps) {
  const [selectedDate, setSelectedDateState] = useState<string>(
    () => hubState.diarySelectedDate
  );
  const [dayDiaries, setDayDiaries] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuDiary, setMenuDiary] = useState<DiaryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiaryItem | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(
    null
  );

  const bodyRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const pressStart = useRef<{ x: number; y: number } | null>(null);

  const setSelectedDate = (dateKey: string) => {
    setSelectedDateState(dateKey);
    hubState.diarySelectedDate = dateKey;
  };

  // Metadata-only scan (zero cachedRead) for calendar dots — fast even with 4000+ notes
  const allMetas: DiaryMeta[] = useMemo(() => {
    const files = getMarkdownFilesInFolder(app, settings.diaryFolder);
    const list = files.map((file) => {
      const { dateKey, timeText, sortKey } = resolveDiaryDateTime(app, file);
      return { file, dateKey, timeText, sortKey };
    });
    list.sort((a, b) => a.sortKey - b.sortKey);
    return list;
  }, [app, settings.diaryFolder, refreshTick]);

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    for (const m of allMetas) {
      set.add(m.dateKey);
    }
    return set;
  }, [allMetas]);

  // Only cachedRead entries for the currently selected date
  useEffect(() => {
    let cancelled = false;
    const loadDay = async () => {
      const metas = allMetas.filter((m) => m.dateKey === selectedDate);
      const loaded: DiaryItem[] = await Promise.all(
        metas.map(async (m) => {
          const raw = await app.vault.cachedRead(m.file);
          const allImages = extractImagesFromContent(app, raw, m.file.path, 20);
          const maxLines = allImages.length > 0 ? 3 : 6;
          const preview = cleanMarkdownPreview(raw, maxLines + 2);
          const lineCount = preview ? preview.split("\n").length : 0;
          const isOverflow =
            lineCount > maxLines || preview.length > (allImages.length > 0 ? 90 : 180);
          return {
            path: m.file.path,
            basename: m.file.basename,
            dateKey: m.dateKey,
            timeText: m.timeText,
            sortKey: m.sortKey,
            preview,
            isOverflow,
            images: allImages.slice(0, 3),
            allImages,
          };
        })
      );
      if (!cancelled) {
        setDayDiaries(loaded);
        setLoading(false);
      }
    };
    loadDay();
    return () => {
      cancelled = true;
    };
  }, [app, allMetas, selectedDate]);

  useEffect(() => {
    if (!loading && bodyRef.current && hubState.diaryScrollTop > 0) {
      bodyRef.current.scrollTop = hubState.diaryScrollTop;
    }
  }, [loading]);

  const handleOpen = async (path: string) => {
    const file = app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await openFileInEditor(app, file);
    }
  };

  const handleCreateDiary = async () => {
    try {
      await ensureFolder(app, settings.diaryFolder);
      const now = new Date();
      const hh = pad2(now.getHours());
      const mm = pad2(now.getMinutes());
      const base = `${selectedDate} ${hh}-${mm}`;
      const newPath = await getUniqueFilePath(app, settings.diaryFolder, base, "md");
      const frontmatter = `---\ndate: ${selectedDate} ${hh}:${mm}\n---\n\n`;
      const file = await app.vault.create(newPath, frontmatter);
      onTrackDraft(file.path);
      await openFileInEditor(app, file);
    } catch (err) {
      new Notice(`新建日记失败: ${String(err)}`);
    }
  };

  const handleDeleteDiary = async () => {
    if (!deleteTarget) return;
    const file = app.vault.getAbstractFileByPath(deleteTarget.path);
    try {
      if (file instanceof TFile) {
        await app.vault.trash(file, true);
        new Notice("已移至回收站");
      }
    } catch (err) {
      new Notice(`删除失败: ${String(err)}`);
    }
    setDeleteTarget(null);
  };

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const startLongPress = (entry: DiaryItem, x: number, y: number) => {
    clearLongPress();
    longPressTriggered.current = false;
    pressStart.current = { x, y };
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      longPressTriggered.current = true;
      navigator.vibrate?.(15);
      setMenuDiary(entry);
    }, 320);
  };

  const moveLongPress = (x: number, y: number) => {
    if (!pressStart.current) return;
    const dx = Math.abs(x - pressStart.current.x);
    const dy = Math.abs(y - pressStart.current.y);
    if (dx > 14 || dy > 14) {
      clearLongPress();
      pressStart.current = null;
    }
  };

  const endLongPress = () => {
    clearLongPress();
    pressStart.current = null;
  };

  return (
    <div class="mh-tab-page mh-diary-page">
      <div class="mh-calendar-sticky">
        <CalendarPanel
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDates={markedDates}
          collapsible
          initialCollapsed={hubState.diaryCollapsed}
          onCollapsedChange={(c) => {
            hubState.diaryCollapsed = c;
          }}
          weekStartsMonday={settings.weekStartsMonday}
        />
      </div>

      <div
        ref={bodyRef}
        class="mh-diary-body"
        onScroll={(e) => {
          hubState.diaryScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
        }}
      >
        {!loading && dayDiaries.length === 0 ? (
          <div class="mh-empty-state">
            <ObsidianIcon name="inbox" size={44} className="mh-empty-icon" />
            <div class="mh-empty-text">暂无日记</div>
          </div>
        ) : (
          <div class="mh-timeline">
            {dayDiaries.map((entry) => {
              const extraImages = Math.max(0, entry.allImages.length - 3);
              return (
                <div key={entry.path} class="mh-timeline-item">
                  <div class="mh-timeline-rail">
                    <span class="mh-timeline-dot" />
                    <span class="mh-timeline-line" />
                  </div>
                  <div class="mh-timeline-content">
                    <div class="mh-timeline-header">
                      <span class="mh-timeline-time">{entry.timeText}</span>
                      <span class="mh-timeline-sub">{entry.basename}</span>
                    </div>
                    <article
                      class={`mh-diary-card ${entry.images.length > 0 ? "has-images" : ""}`}
                      onTouchStart={(e) => {
                        if (e.touches.length === 1) {
                          startLongPress(
                            entry,
                            e.touches[0].clientX,
                            e.touches[0].clientY
                          );
                        }
                      }}
                      onTouchMove={(e) => {
                        if (e.touches.length === 1) {
                          moveLongPress(e.touches[0].clientX, e.touches[0].clientY);
                        }
                      }}
                      onTouchEnd={endLongPress}
                      onTouchCancel={endLongPress}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        clearLongPress();
                        longPressTriggered.current = true;
                        setMenuDiary(entry);
                      }}
                      onClick={() => {
                        if (longPressTriggered.current) {
                          longPressTriggered.current = false;
                          return;
                        }
                        handleOpen(entry.path);
                      }}
                    >
                      {entry.images.length > 0 && (
                        <div class="mh-diary-images">
                          {entry.images.map((src, i) => (
                            <div
                              key={i}
                              class="mh-diary-thumb-wrap"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (longPressTriggered.current) {
                                  longPressTriggered.current = false;
                                  return;
                                }
                                setLightbox({ images: entry.allImages, index: i });
                              }}
                            >
                              <img
                                src={src}
                                class="mh-diary-thumb"
                                loading="lazy"
                                draggable={false}
                                alt=""
                              />
                              {i === 2 && extraImages > 0 && (
                                <span class="mh-diary-thumb-more">
                                  +{extraImages}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {entry.preview ? (
                        <div
                          class={`mh-diary-text ${entry.isOverflow ? "is-overflow" : ""}`}
                        >
                          {entry.preview}
                        </div>
                      ) : entry.images.length === 0 ? (
                        <div class="mh-diary-text is-muted">（空白日记）</div>
                      ) : null}
                    </article>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        class="mh-fab"
        aria-label="写日记"
        onClick={handleCreateDiary}
      >
        <ObsidianIcon name="pencil" size={22} />
      </button>

      {/* Lightbox Image Preview */}
      {lightbox &&
        createPortal(
          <div
            class="mh-lightbox-backdrop"
            onClick={() => setLightbox(null)}
          >
            <img
              src={lightbox.images[lightbox.index]}
              class="mh-lightbox-img"
              alt=""
              onClick={(e) => e.stopPropagation()}
            />
            {lightbox.images.length > 1 && (
              <div
                class="mh-lightbox-controls"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  class="mh-lightbox-nav"
                  aria-label="上一张"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev
                        ? {
                            ...prev,
                            index:
                              (prev.index - 1 + prev.images.length) %
                              prev.images.length,
                          }
                        : null
                    )
                  }
                >
                  <ObsidianIcon name="chevron-left" size={22} />
                </button>
                <span class="mh-lightbox-counter">
                  {lightbox.index + 1} / {lightbox.images.length}
                </span>
                <button
                  type="button"
                  class="mh-lightbox-nav"
                  aria-label="下一张"
                  onClick={() =>
                    setLightbox((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: (prev.index + 1) % prev.images.length,
                          }
                        : null
                    )
                  }
                >
                  <ObsidianIcon name="chevron-right" size={22} />
                </button>
              </div>
            )}
          </div>,
          document.body
        )}

      {/* Long-press bottom drawer (unified 3-tier Yuque layout) */}
      <BottomSheet
        open={menuDiary !== null}
        onClose={() => setMenuDiary(null)}
        showCancel
      >
        {menuDiary && (
          <div class="mh-row-sheet-content">
            <div class="mh-quick-grid">
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => {
                  const target = menuDiary;
                  setMenuDiary(null);
                  handleOpen(target.path);
                }}
              >
                <ObsidianIcon name="pencil" size={22} />
                <span>编辑</span>
              </button>
            </div>
            <div class="mh-action-list">
              <button
                type="button"
                class="mh-action-item is-danger"
                onClick={() => {
                  const target = menuDiary;
                  setMenuDiary(null);
                  setDeleteTarget(target);
                }}
              >
                <span>删除</span>
                <ObsidianIcon name="trash-2" size={18} />
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      <PromptModal
        open={deleteTarget !== null}
        title="删除日记"
        message={`确定将日记「${deleteTarget?.basename ?? ""}」移至回收站吗？`}
        confirmText="删除"
        danger
        confirmOnly
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteDiary}
      />
    </div>
  );
}
