import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { App, TFile, Notice } from "obsidian";
import { DiaryItem, MobileHubSettings } from "../types";
import {
  cleanMarkdownPreview,
  ensureFolder,
  extractImagesFromContent,
  formatDateKey,
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
  refreshTick: number;
}

export function DiaryTab({ app, settings, refreshTick }: DiaryTabProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    formatDateKey(new Date())
  );
  const [allDiaries, setAllDiaries] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuDiary, setMenuDiary] = useState<DiaryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiaryItem | null>(null);

  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const pressStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const files = getMarkdownFilesInFolder(app, settings.diaryFolder);
      const loaded: DiaryItem[] = await Promise.all(
        files.map(async (f) => {
          const raw = await app.vault.cachedRead(f);
          const { dateKey, timeText, sortKey } = resolveDiaryDateTime(app, f);
          const preview = cleanMarkdownPreview(raw, 6);
          const images = extractImagesFromContent(app, raw, f.path, 3);
          return {
            path: f.path,
            basename: f.basename,
            dateKey,
            timeText,
            sortKey,
            preview,
            images,
          };
        })
      );

      loaded.sort((a, b) => a.sortKey - b.sortKey);
      if (!cancelled) {
        setAllDiaries(loaded);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [app, settings.diaryFolder, refreshTick]);

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    for (const d of allDiaries) {
      set.add(d.dateKey);
    }
    return set;
  }, [allDiaries]);

  const dayDiaries = useMemo(() => {
    return allDiaries.filter((d) => d.dateKey === selectedDate);
  }, [allDiaries, selectedDate]);

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
      await openFileInEditor(app, file);
    } catch (err) {
      new Notice(`新建日记失败: ${String(err)}`);
    }
  };

  const handleDeleteDiary = async () => {
    if (!deleteTarget) return;
    const file = app.vault.getAbstractFileByPath(deleteTarget.path);
    if (file instanceof TFile) {
      await app.vault.trash(file, true);
    }
    setDeleteTarget(null);
  };

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleCardPointerDown = (entry: DiaryItem, e: PointerEvent) => {
    clearLongPress();
    longPressTriggered.current = false;
    pressStart.current = { x: e.clientX, y: e.clientY };
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      longPressTriggered.current = true;
      navigator.vibrate?.(15);
      setMenuDiary(entry);
    }, 380);
  };

  const handleCardPointerMove = (e: PointerEvent) => {
    if (!pressStart.current) return;
    const dx = Math.abs(e.clientX - pressStart.current.x);
    const dy = Math.abs(e.clientY - pressStart.current.y);
    if (dx > 10 || dy > 10) {
      clearLongPress();
      pressStart.current = null;
    }
  };

  const handleCardPointerUp = () => {
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
          weekStartsMonday
        />
      </div>

      <div class="mh-diary-body">
        {!loading && dayDiaries.length === 0 ? (
          <div class="mh-empty-state">
            <ObsidianIcon name="inbox" size={44} className="mh-empty-icon" />
            <div class="mh-empty-text">暂无日记</div>
          </div>
        ) : (
          <div class="mh-timeline">
            {dayDiaries.map((entry) => (
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
                    class="mh-diary-card"
                    onPointerDown={(e) => handleCardPointerDown(entry, e)}
                    onPointerMove={handleCardPointerMove}
                    onPointerUp={handleCardPointerUp}
                    onPointerCancel={handleCardPointerUp}
                    onContextMenu={(e) => {
                      e.preventDefault();
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
                          <img
                            key={i}
                            src={src}
                            class="mh-diary-thumb"
                            loading="lazy"
                            alt=""
                          />
                        ))}
                      </div>
                    )}
                    {entry.preview ? (
                      <div class="mh-diary-text">{entry.preview}</div>
                    ) : entry.images.length === 0 ? (
                      <div class="mh-diary-text is-muted">（空白日记）</div>
                    ) : null}
                  </article>
                </div>
              </div>
            ))}
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

      {/* Long-press bottom drawer (Edit / Delete / Cancel — unified Yuque 3-tier layout) */}
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
