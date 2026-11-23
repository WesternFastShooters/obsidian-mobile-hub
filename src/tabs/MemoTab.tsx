import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { App, TFile, Notice } from "obsidian";
import { HubRuntimeState, MemoItem, MobileHubSettings } from "../types";
import {
  cleanMarkdownPreview,
  ensureFolder,
  formatDateTime,
  getMarkdownFilesInFolder,
  getUniqueFilePath,
  openFileInEditor,
  pad2,
} from "../utils/obsidian";
import { ObsidianIcon } from "../components/ObsidianIcon";
import { BottomSheet } from "../components/BottomSheet";
import { PromptModal } from "../components/PromptModal";

interface MemoTabProps {
  app: App;
  settings: MobileHubSettings;
  hubState: HubRuntimeState;
  refreshTick: number;
  onTrackDraft: (path: string) => void;
}

const INITIAL_FAST_COUNT = 8;
const PAGE_SIZE = 20;

export function MemoTab({
  app,
  settings,
  hubState,
  refreshTick,
  onTrackDraft,
}: MemoTabProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [items, setItems] = useState<MemoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuItem, setMenuItem] = useState<MemoItem | null>(null);
  const [renameTarget, setRenameTarget] = useState<MemoItem | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const allFiles = useMemo(() => {
    const files = getMarkdownFilesInFolder(app, settings.memoFolder);
    files.sort((a, b) => b.stat.mtime - a.stat.mtime);
    return files;
  }, [app, settings.memoFolder, refreshTick]);

  // Two-stage progressive load: first 8 cards paint immediately, remaining hydrate in background
  useEffect(() => {
    let cancelled = false;
    const readFile = async (f: TFile): Promise<MemoItem> => {
      const raw = await app.vault.cachedRead(f);
      const preview = cleanMarkdownPreview(raw, 12) || f.basename;
      const lineCount = preview.split("\n").length;
      const isOverflow = lineCount > 8 || preview.length > 240;
      return {
        path: f.path,
        basename: f.basename,
        preview,
        isOverflow,
        timeText: formatDateTime(f.stat.mtime),
        mtime: f.stat.mtime,
        ctime: f.stat.ctime,
      };
    };

    const load = async () => {
      const slice = allFiles.slice(0, visibleCount);
      if (slice.length === 0) {
        if (!cancelled) {
          setItems([]);
          setLoading(false);
        }
        return;
      }

      const firstBatch = slice.slice(0, INITIAL_FAST_COUNT);
      const firstLoaded = await Promise.all(firstBatch.map(readFile));
      if (cancelled) return;
      setItems(firstLoaded);
      setLoading(false);

      if (slice.length > INITIAL_FAST_COUNT) {
        const restBatch = slice.slice(INITIAL_FAST_COUNT);
        const restLoaded = await Promise.all(restBatch.map(readFile));
        if (!cancelled) {
          setItems([...firstLoaded, ...restLoaded]);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [app, allFiles, visibleCount]);

  // Restore scroll position after initial items render
  useEffect(() => {
    if (!loading && pageRef.current && hubState.memoScrollTop > 0) {
      pageRef.current.scrollTop = hubState.memoScrollTop;
    }
  }, [loading]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= allFiles.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allFiles.length));
        }
      },
      { root: pageRef.current, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [allFiles.length, visibleCount]);

  const handleOpen = async (path: string) => {
    const file = app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await openFileInEditor(app, file);
    }
  };

  const handleCreateMemo = async () => {
    try {
      await ensureFolder(app, settings.memoFolder);
      const now = new Date();
      const base = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}-${pad2(now.getMinutes())}`;
      const newPath = await getUniqueFilePath(app, settings.memoFolder, base, "md");
      const file = await app.vault.create(newPath, "");
      onTrackDraft(file.path);
      await openFileInEditor(app, file);
    } catch (err) {
      new Notice(`新建备忘录失败: ${String(err)}`);
    }
  };

  const handleRename = async (newName: string) => {
    if (!renameTarget) return;
    const file = app.vault.getAbstractFileByPath(renameTarget.path);
    if (file instanceof TFile) {
      const parentPath = file.parent ? file.parent.path : settings.memoFolder;
      const targetPath = parentPath ? `${parentPath}/${newName}.md` : `${newName}.md`;
      if (targetPath !== file.path && app.vault.getAbstractFileByPath(targetPath)) {
        new Notice("同名备忘录已存在");
        return;
      }
      try {
        await app.fileManager.renameFile(file, targetPath);
        new Notice("已重命名");
      } catch (err) {
        new Notice(`重命名失败: ${String(err)}`);
      }
    }
    setRenameTarget(null);
  };

  const handleDelete = async (target: MemoItem) => {
    const file = app.vault.getAbstractFileByPath(target.path);
    try {
      if (file instanceof TFile) {
        await app.vault.trash(file, true);
        new Notice("已移至回收站");
      }
    } catch (err) {
      new Notice(`删除失败: ${String(err)}`);
    }
  };

  return (
    <div class="mh-tab-page mh-memo-page">
      <div
        ref={pageRef}
        class="mh-memo-scroll"
        onScroll={(e) => {
          hubState.memoScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
        }}
      >
        {!loading && items.length === 0 ? (
          <div class="mh-empty-state">
            <ObsidianIcon name="sticky-note" size={40} className="mh-empty-icon" />
            <div class="mh-empty-text">暂无备忘录</div>
            <div class="mh-empty-sub">点击下方 + 记录第一条灵感</div>
          </div>
        ) : (
          <div class="mh-memo-list">
            {items.map((item) => (
              <article
                key={item.path}
                class="mh-memo-card"
                onClick={() => handleOpen(item.path)}
              >
                <div
                  class={`mh-memo-preview ${item.isOverflow ? "is-overflow" : ""}`}
                >
                  {item.preview}
                </div>
                <div class="mh-memo-footer">
                  <span class="mh-memo-time">{item.timeText}</span>
                  <button
                    type="button"
                    class="mh-icon-btn mh-more-btn"
                    aria-label="更多操作"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuItem(item);
                    }}
                  >
                    <ObsidianIcon name="more-horizontal" size={18} />
                  </button>
                </div>
              </article>
            ))}
            {visibleCount < allFiles.length && (
              <div ref={sentinelRef} class="mh-load-more">
                加载更多...
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        class="mh-fab"
        aria-label="新建备忘录"
        onClick={handleCreateMemo}
      >
        <ObsidianIcon name="plus" size={24} />
      </button>

      <BottomSheet
        open={menuItem !== null}
        onClose={() => setMenuItem(null)}
        showCancel
      >
        {menuItem && (
          <div class="mh-row-sheet-content">
            <div class="mh-quick-grid">
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => {
                  const target = menuItem;
                  setMenuItem(null);
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
                class="mh-action-item"
                onClick={() => {
                  const target = menuItem;
                  setMenuItem(null);
                  setRenameTarget(target);
                }}
              >
                <span>重命名</span>
                <ObsidianIcon name="edit-3" size={18} />
              </button>
              <button
                type="button"
                class="mh-action-item is-danger"
                onClick={() => {
                  const target = menuItem;
                  setMenuItem(null);
                  handleDelete(target);
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
        open={renameTarget !== null}
        title="重命名备忘录"
        initialValue={renameTarget?.basename ?? ""}
        placeholder="输入新名称"
        onCancel={() => setRenameTarget(null)}
        onConfirm={handleRename}
      />
    </div>
  );
}
