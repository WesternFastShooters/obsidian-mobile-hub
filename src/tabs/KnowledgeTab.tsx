import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { App, TAbstractFile, TFile, TFolder, Notice, normalizePath } from "obsidian";
import { HubRuntimeState, KnowledgeRootItem, MobileHubSettings } from "../types";
import {
  formatShortDateTime,
  getFilesInFolderRecursive,
  getUniqueFilePath,
  isDescendantPath,
  openFileInEditor,
  openObsidianSwitcher,
  sortChildrenWithCustomOrder,
} from "../utils/obsidian";
import { ObsidianIcon } from "../components/ObsidianIcon";
import { BottomSheet } from "../components/BottomSheet";
import { PromptModal } from "../components/PromptModal";

interface KnowledgeTabProps {
  app: App;
  settings: MobileHubSettings;
  hubState: HubRuntimeState;
  refreshTick: number;
  onRootPathChange: (path: string | null) => void;
  onUpdateCustomOrder: (folderPath: string, orderedNames: string[]) => Promise<void>;
  onReplaceCustomOrderMap: (nextMap: Record<string, string[]>) => Promise<void>;
}

interface TreeRow {
  file: TAbstractFile;
  path: string;
  parentPath: string;
  name: string;
  displayName: string;
  isFolder: boolean;
  iconName: string;
  depth: number;
  expanded: boolean;
}

type DropPosition = "before" | "after" | "inside";

interface DragState {
  sourcePath: string;
  sourceName: string;
  targetPath: string | null;
  position: DropPosition | null;
  pointerX: number;
  pointerY: number;
}

type PromptAction =
  | { type: "new-note"; parentPath: string }
  | { type: "new-folder"; parentPath: string }
  | { type: "rename"; target: TAbstractFile }
  | { type: "delete"; target: TAbstractFile };

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"]);

function getFileIconName(file: TAbstractFile): string {
  if (file instanceof TFolder) return "folder";
  if (file instanceof TFile) {
    const ext = file.extension.toLowerCase();
    if (ext === "md") return "file-text";
    if (IMAGE_EXTS.has(ext)) return "image";
  }
  return "file";
}

export function KnowledgeTab({
  app,
  settings,
  hubState,
  refreshTick,
  onRootPathChange,
  onUpdateCustomOrder,
  onReplaceCustomOrderMap,
}: KnowledgeTabProps) {
  const [activeRootPath, setActiveRootPathState] = useState<string | null>(
    () => hubState.kbRootPath
  );
  const [expandedPaths, setExpandedPathsState] = useState<Set<string>>(
    () => new Set(hubState.kbExpandedPaths)
  );
  const [fabSheetOpen, setFabSheetOpen] = useState(false);
  const [rowMenuTarget, setRowMenuTarget] = useState<TAbstractFile | null>(null);
  const [promptAction, setPromptAction] = useState<PromptAction | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const longPressTimer = useRef<number | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const justDraggedRef = useRef(false);
  const pointerYRef = useRef(0);
  const autoScrollRafRef = useRef<number | null>(null);
  const treeListRef = useRef<HTMLDivElement>(null);
  const rootListRef = useRef<HTMLDivElement>(null);

  const setActiveRootPath = (path: string | null) => {
    setActiveRootPathState(path);
    onRootPathChange(path);
  };

  const setExpandedPaths = (updater: (prev: Set<string>) => Set<string>) => {
    setExpandedPathsState((prev) => {
      const next = updater(prev);
      hubState.kbExpandedPaths = Array.from(next);
      return next;
    });
  };

  const excludedSet = useMemo(() => {
    return new Set<string>([
      settings.memoFolder,
      settings.diaryFolder,
      ...settings.excludedFolders,
    ]);
  }, [settings]);

  // Level-1 knowledge bases
  const rootItems: KnowledgeRootItem[] = useMemo(() => {
    const root = app.vault.getRoot();
    const folders = root.children.filter(
      (c): c is TFolder =>
        c instanceof TFolder && !c.name.startsWith(".") && !excludedSet.has(c.name)
    );
    const sorted = sortChildrenWithCustomOrder(
      folders,
      settings.customOrder[""]
    ) as TFolder[];

    return sorted.map((folder) => {
      const files = getFilesInFolderRecursive(folder).filter(
        (f) => f.extension === "md"
      );
      let latest = 0;
      for (const f of files) {
        if (f.stat.mtime > latest) latest = f.stat.mtime;
      }
      return {
        path: folder.path,
        name: folder.name,
        docCount: files.length,
        latestMtime: latest,
        latestTimeText: latest ? formatShortDateTime(latest) : "暂无更新",
      };
    });
  }, [app, excludedSet, settings.customOrder, refreshTick]);

  const activeRootFolder = useMemo(() => {
    if (!activeRootPath) return null;
    const f = app.vault.getAbstractFileByPath(activeRootPath);
    return f instanceof TFolder ? f : null;
  }, [app, activeRootPath, refreshTick]);

  useEffect(() => {
    if (activeRootPath && !activeRootFolder) {
      setActiveRootPath(null);
    }
  }, [activeRootPath, activeRootFolder]);

  // Restore scroll position
  useEffect(() => {
    const el = activeRootFolder ? treeListRef.current : rootListRef.current;
    if (el && hubState.kbScrollTop > 0) {
      el.scrollTop = hubState.kbScrollTop;
    }
  }, [activeRootFolder]);

  // Lock native touch scrolling & run edge auto-scroll while dragging (P0 #2)
  useEffect(() => {
    if (!dragState) {
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
      return;
    }

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    window.addEventListener("touchmove", preventTouchMove, { passive: false });

    const tickScroll = () => {
      const list = treeListRef.current;
      if (list) {
        const rect = list.getBoundingClientRect();
        const y = pointerYRef.current;
        const edge = 64;
        if (y < rect.top + edge) {
          const factor = Math.max(0.2, (rect.top + edge - y) / edge);
          list.scrollTop -= Math.round(10 * factor);
        } else if (y > rect.bottom - edge) {
          const factor = Math.max(0.2, (y - (rect.bottom - edge)) / edge);
          list.scrollTop += Math.round(10 * factor);
        }
      }
      autoScrollRafRef.current = requestAnimationFrame(tickScroll);
    };
    autoScrollRafRef.current = requestAnimationFrame(tickScroll);

    return () => {
      window.removeEventListener("touchmove", preventTouchMove);
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    };
  }, [Boolean(dragState)]);

  // Level-2 flattened tree rows
  const treeRows: TreeRow[] = useMemo(() => {
    if (!activeRootFolder) return [];
    const rows: TreeRow[] = [];

    const walk = (folder: TFolder, depth: number) => {
      const children = folder.children.filter((c) => !c.name.startsWith("."));
      const sorted = sortChildrenWithCustomOrder(
        children,
        settings.customOrder[folder.path]
      );
      for (const child of sorted) {
        const isFolder = child instanceof TFolder;
        const expanded = isFolder && expandedPaths.has(child.path);
        const displayName =
          child instanceof TFile && child.extension === "md"
            ? child.basename
            : child.name;
        rows.push({
          file: child,
          path: child.path,
          parentPath: folder.path,
          name: child.name,
          displayName,
          isFolder,
          iconName: getFileIconName(child),
          depth,
          expanded,
        });
        if (isFolder && expanded) {
          walk(child, depth + 1);
        }
      }
    };

    walk(activeRootFolder, 0);
    return rows;
  }, [activeRootFolder, expandedPaths, settings.customOrder, refreshTick]);

  const toggleExpand = (folderPath: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) next.delete(folderPath);
      else next.add(folderPath);
      return next;
    });
  };

  // Level-1 reorder (Move Up / Move Down) — P1 #7
  const handleMoveRootFolder = async (folderName: string, delta: -1 | 1) => {
    const names = rootItems.map((r) => r.name);
    const idx = names.indexOf(folderName);
    const targetIdx = idx + delta;
    if (idx === -1 || targetIdx < 0 || targetIdx >= names.length) return;
    [names[idx], names[targetIdx]] = [names[targetIdx], names[idx]];
    await onUpdateCustomOrder("", names);
  };

  // CRUD handlers with conflict checks & customOrder migration (P1 #7 & P2 #14)
  const executePrompt = async (value: string) => {
    if (!promptAction) return;
    const action = promptAction;
    setPromptAction(null);

    try {
      if (action.type === "new-note") {
        const path = await getUniqueFilePath(app, action.parentPath, value, "md");
        const file = await app.vault.create(path, "");
        if (action.parentPath) {
          setExpandedPaths((prev) => new Set(prev).add(action.parentPath));
        }
        await openFileInEditor(app, file);
      } else if (action.type === "new-folder") {
        const targetPath = action.parentPath
          ? normalizePath(`${action.parentPath}/${value}`)
          : normalizePath(value);
        if (app.vault.getAbstractFileByPath(targetPath)) {
          new Notice("同名文件夹已存在");
          return;
        }
        await app.vault.createFolder(targetPath);
        if (action.parentPath) {
          setExpandedPaths((prev) => new Set(prev).add(action.parentPath));
        }
        new Notice("已创建文件夹");
      } else if (action.type === "rename") {
        const oldPath = action.target.path;
        const oldName = action.target.name;
        const parentPath = action.target.parent?.path ?? "";
        const ext =
          action.target instanceof TFile && action.target.extension
            ? `.${action.target.extension}`
            : "";
        const newName = ext && value.endsWith(ext) ? value : `${value}${ext}`;
        const nextPath = parentPath
          ? normalizePath(`${parentPath}/${newName}`)
          : normalizePath(newName);

        if (nextPath === oldPath) return;
        if (app.vault.getAbstractFileByPath(nextPath)) {
          new Notice("同名文件或文件夹已存在");
          return;
        }

        await app.fileManager.renameFile(action.target, nextPath);

        // Migrate customOrder entries so custom sorting never breaks on rename
        const nextOrderMap: Record<string, string[]> = {};
        for (const [key, list] of Object.entries(settings.customOrder)) {
          let newKey = key;
          if (action.target instanceof TFolder) {
            if (key === oldPath) newKey = nextPath;
            else if (key.startsWith(`${oldPath}/`)) {
              newKey = `${nextPath}${key.slice(oldPath.length)}`;
            }
          }
          nextOrderMap[newKey] =
            key === parentPath
              ? list.map((n) => (n === oldName ? newName : n))
              : list;
        }
        await onReplaceCustomOrderMap(nextOrderMap);

        if (activeRootPath === oldPath) {
          setActiveRootPath(nextPath);
        }
        new Notice("已重命名");
      } else if (action.type === "delete") {
        await app.vault.trash(action.target, true);
        new Notice("已移至回收站");
      }
    } catch (err) {
      new Notice(`操作失败: ${String(err)}`);
    }
  };

  // --- Drag & Drop (Long-press to reorder or move into folder) ---
  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleRowPointerDown = (row: TreeRow, e: PointerEvent) => {
    if ((e.target as HTMLElement).closest(".mh-more-btn")) return;
    clearLongPress();
    justDraggedRef.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    pointerYRef.current = e.clientY;

    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      justDraggedRef.current = true;
      navigator.vibrate?.(15);
      setDragState({
        sourcePath: row.path,
        sourceName: row.displayName,
        targetPath: null,
        position: null,
        pointerX: e.clientX,
        pointerY: e.clientY,
      });
    }, 280);
  };

  const handleTreePointerMove = (e: PointerEvent) => {
    if (!dragState) {
      if (dragStartPos.current) {
        const dx = Math.abs(e.clientX - dragStartPos.current.x);
        const dy = Math.abs(e.clientY - dragStartPos.current.y);
        if (dx > 8 || dy > 8) {
          clearLongPress();
          dragStartPos.current = null;
        }
      }
      return;
    }

    e.preventDefault();
    pointerYRef.current = e.clientY;

    const rowEls = treeListRef.current?.querySelectorAll<HTMLElement>(
      "[data-tree-path]"
    );
    if (!rowEls) return;

    let hitPath: string | null = null;
    let hitPos: DropPosition | null = null;

    for (const el of Array.from(rowEls)) {
      const rect = el.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const path = el.dataset.treePath || "";
        const isFolder = el.dataset.isFolder === "true";
        if (
          path === dragState.sourcePath ||
          isDescendantPath(dragState.sourcePath, path)
        ) {
          break;
        }
        const ratio = (e.clientY - rect.top) / Math.max(rect.height, 1);
        hitPath = path;
        if (isFolder) {
          if (ratio < 0.25) hitPos = "before";
          else if (ratio > 0.75) hitPos = "after";
          else hitPos = "inside";
        } else {
          hitPos = ratio < 0.5 ? "before" : "after";
        }
        break;
      }
    }

    setDragState((prev) =>
      prev
        ? {
            ...prev,
            targetPath: hitPath,
            position: hitPos,
            pointerX: e.clientX,
            pointerY: e.clientY,
          }
        : null
    );
  };

  const handleTreePointerUp = async () => {
    clearLongPress();
    dragStartPos.current = null;
    if (!dragState) return;

    const { sourcePath, targetPath, position } = dragState;
    setDragState(null);

    // Keep justDraggedRef true through the synthetic click tick to prevent accidental open/collapse
    window.setTimeout(() => {
      justDraggedRef.current = false;
    }, 80);

    if (!targetPath || !position || sourcePath === targetPath) return;
    if (isDescendantPath(sourcePath, targetPath)) return;

    const sourceFile = app.vault.getAbstractFileByPath(sourcePath);
    const targetFile = app.vault.getAbstractFileByPath(targetPath);
    if (!sourceFile || !targetFile) return;

    try {
      if (position === "inside" && targetFile instanceof TFolder) {
        const destPath = normalizePath(`${targetFile.path}/${sourceFile.name}`);
        if (destPath !== sourceFile.path) {
          await app.fileManager.renameFile(sourceFile, destPath);
          setExpandedPaths((prev) => new Set(prev).add(targetFile.path));
        }
        return;
      }

      const targetParent = targetFile.parent;
      if (!targetParent) return;

      if (sourceFile.parent?.path !== targetParent.path) {
        const destPath = targetParent.path
          ? normalizePath(`${targetParent.path}/${sourceFile.name}`)
          : normalizePath(sourceFile.name);
        await app.fileManager.renameFile(sourceFile, destPath);
      }

      const siblings = sortChildrenWithCustomOrder(
        targetParent.children.filter((c) => !c.name.startsWith(".")),
        settings.customOrder[targetParent.path]
      ).map((c) => c.name);

      const filtered = siblings.filter((n) => n !== sourceFile.name);
      const targetIdx = filtered.indexOf(targetFile.name);
      if (targetIdx === -1) return;
      const insertIdx = position === "before" ? targetIdx : targetIdx + 1;
      filtered.splice(insertIdx, 0, sourceFile.name);

      await onUpdateCustomOrder(targetParent.path, filtered);
    } catch (err) {
      new Notice(`移动或排序失败: ${String(err)}`);
    }
  };

  const currentCreateParent = activeRootFolder ? activeRootFolder.path : "";

  const getRowActionParent = (target: TAbstractFile): string => {
    if (target instanceof TFolder) return target.path;
    return target.parent?.path ?? "";
  };

  const isMenuTargetRootKb =
    rowMenuTarget !== null &&
    !activeRootFolder &&
    rowMenuTarget instanceof TFolder &&
    rowMenuTarget.parent?.isRoot();

  const rootKbIndex = isMenuTargetRootKb
    ? rootItems.findIndex((r) => r.name === rowMenuTarget.name)
    : -1;

  return (
    <div class="mh-tab-page mh-kb-page">
      {!activeRootFolder ? (
        <div
          ref={rootListRef}
          class="mh-kb-list"
          onScroll={(e) => {
            hubState.kbScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
          }}
        >
          {rootItems.length === 0 ? (
            <div class="mh-empty-state">
              <ObsidianIcon name="book-open" size={40} className="mh-empty-icon" />
              <div class="mh-empty-text">暂无知识库</div>
              <div class="mh-empty-sub">点击下方 + 新建文件夹作为知识库</div>
            </div>
          ) : (
            rootItems.map((kb) => (
              <div
                key={kb.path}
                class="mh-kb-item"
                onClick={() => {
                  hubState.kbScrollTop = 0;
                  setActiveRootPath(kb.path);
                }}
              >
                <div class="mh-kb-icon-box">
                  <ObsidianIcon name="book-marked" size={20} />
                </div>
                <div class="mh-kb-info">
                  <div class="mh-kb-name">{kb.name}</div>
                  <div class="mh-kb-meta">
                    共 {kb.docCount} 篇文档 · {kb.latestTimeText}
                  </div>
                </div>
                <button
                  type="button"
                  class="mh-icon-btn mh-more-btn"
                  aria-label="知识库菜单"
                  onClick={(e) => {
                    e.stopPropagation();
                    const f = app.vault.getAbstractFileByPath(kb.path);
                    if (f) setRowMenuTarget(f);
                  }}
                >
                  <ObsidianIcon name="more-horizontal" size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div
          class={`mh-kb-tree-view ${dragState ? "is-dragging" : ""}`}
          onPointerMove={handleTreePointerMove}
          onPointerUp={handleTreePointerUp}
          onPointerCancel={handleTreePointerUp}
        >
          <div class="mh-kb-tree-header">
            <button
              type="button"
              class="mh-icon-btn mh-back-btn"
              aria-label="返回知识库列表"
              onClick={() => {
                hubState.kbScrollTop = 0;
                setActiveRootPath(null);
              }}
            >
              <ObsidianIcon name="chevron-left" size={22} />
            </button>
            <div class="mh-kb-tree-title">{activeRootFolder.name}</div>
            <button
              type="button"
              class="mh-icon-btn mh-kb-header-more-btn"
              aria-label="文件夹操作"
              onClick={() => setRowMenuTarget(activeRootFolder)}
            >
              <ObsidianIcon name="more-horizontal" size={20} />
            </button>
          </div>

          <div
            ref={treeListRef}
            class="mh-kb-tree-list"
            onScroll={(e) => {
              hubState.kbScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
            }}
          >
            {treeRows.length === 0 ? (
              <div class="mh-empty-state">
                <ObsidianIcon name="folder-open" size={38} className="mh-empty-icon" />
                <div class="mh-empty-text">目录为空</div>
                <div class="mh-empty-sub">点击下方 + 新增笔记或文件夹</div>
              </div>
            ) : (
              treeRows.map((row) => {
                const isSource = dragState?.sourcePath === row.path;
                const isDropBefore =
                  dragState?.targetPath === row.path && dragState.position === "before";
                const isDropAfter =
                  dragState?.targetPath === row.path && dragState.position === "after";
                const isDropInside =
                  dragState?.targetPath === row.path && dragState.position === "inside";

                return (
                  <div
                    key={row.path}
                    data-tree-path={row.path}
                    data-is-folder={String(row.isFolder)}
                    class={[
                      "mh-tree-row",
                      row.isFolder ? "is-folder" : "is-file",
                      isSource ? "is-drag-source" : "",
                      isDropBefore ? "is-drop-before" : "",
                      isDropAfter ? "is-drop-after" : "",
                      isDropInside ? "is-drop-inside" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{ paddingLeft: `${16 + row.depth * 22}px` }}
                    onPointerDown={(e) => handleRowPointerDown(row, e)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => {
                      if (dragState || justDraggedRef.current) return;
                      if (row.isFolder) {
                        toggleExpand(row.path);
                      } else if (row.file instanceof TFile) {
                        openFileInEditor(app, row.file);
                      }
                    }}
                  >
                    <span class="mh-tree-chevron">
                      {row.isFolder ? (
                        <ObsidianIcon
                          name={row.expanded ? "chevron-down" : "chevron-right"}
                          size={15}
                        />
                      ) : (
                        <ObsidianIcon
                          name={row.iconName}
                          size={14}
                          className="mh-tree-file-icon"
                        />
                      )}
                    </span>
                    <span class="mh-tree-label">{row.displayName}</span>
                    <button
                      type="button"
                      class="mh-icon-btn mh-more-btn"
                      aria-label="更多操作"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRowMenuTarget(row.file);
                      }}
                    >
                      <ObsidianIcon name="more-horizontal" size={18} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {dragState && (
            <div
              class="mh-drag-ghost"
              style={{
                left: `${dragState.pointerX}px`,
                top: `${dragState.pointerY}px`,
              }}
            >
              <span>{dragState.sourceName}</span>
            </div>
          )}
        </div>
      )}

      {/* Floating bottom pill (ONLY in Knowledge Base tab, 2 buttons: Search + Plus) */}
      <div class="mh-kb-floating-pill">
        <button
          type="button"
          class="mh-pill-btn"
          aria-label="搜索"
          onClick={() => openObsidianSwitcher(app)}
        >
          <ObsidianIcon name="search" size={20} />
        </button>
        <span class="mh-pill-divider" />
        <button
          type="button"
          class="mh-pill-btn"
          aria-label="新建"
          onClick={() => setFabSheetOpen(true)}
        >
          <ObsidianIcon name="plus-circle" size={21} />
        </button>
      </div>

      {/* Bottom sheet for + button: at Level 1 only allow Folder (avoid orphan root notes); at Level 2 allow Note & Folder */}
      <BottomSheet
        open={fabSheetOpen}
        onClose={() => setFabSheetOpen(false)}
        showCancel
      >
        <div class="mh-create-grid">
          {activeRootFolder && (
            <button
              type="button"
              class="mh-create-tile"
              onClick={() => {
                setFabSheetOpen(false);
                setPromptAction({ type: "new-note", parentPath: currentCreateParent });
              }}
            >
              <ObsidianIcon name="file-plus" size={24} />
              <span>笔记</span>
            </button>
          )}
          <button
            type="button"
            class="mh-create-tile"
            onClick={() => {
              setFabSheetOpen(false);
              setPromptAction({ type: "new-folder", parentPath: currentCreateParent });
            }}
          >
            <ObsidianIcon name="folder-plus" size={24} />
            <span>{activeRootFolder ? "文件夹" : "新建知识库"}</span>
          </button>
        </div>
      </BottomSheet>

      {/* Bottom sheet for row / folder ... menu */}
      <BottomSheet
        open={rowMenuTarget !== null}
        onClose={() => setRowMenuTarget(null)}
        showCancel
      >
        {rowMenuTarget && (
          <div class="mh-row-sheet-content">
            <div class="mh-quick-grid">
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({
                    type: "new-note",
                    parentPath: getRowActionParent(target),
                  });
                }}
              >
                <ObsidianIcon name="file-plus" size={22} />
                <span>新增笔记</span>
              </button>
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({
                    type: "new-folder",
                    parentPath: getRowActionParent(target),
                  });
                }}
              >
                <ObsidianIcon name="folder-plus" size={22} />
                <span>新增文件夹</span>
              </button>
              {isMenuTargetRootKb && rootKbIndex > 0 && (
                <button
                  type="button"
                  class="mh-quick-tile"
                  onClick={() => {
                    const name = rowMenuTarget.name;
                    setRowMenuTarget(null);
                    handleMoveRootFolder(name, -1);
                  }}
                >
                  <ObsidianIcon name="arrow-up" size={22} />
                  <span>上移</span>
                </button>
              )}
              {isMenuTargetRootKb &&
                rootKbIndex >= 0 &&
                rootKbIndex < rootItems.length - 1 && (
                  <button
                    type="button"
                    class="mh-quick-tile"
                    onClick={() => {
                      const name = rowMenuTarget.name;
                      setRowMenuTarget(null);
                      handleMoveRootFolder(name, 1);
                    }}
                  >
                    <ObsidianIcon name="arrow-down" size={22} />
                    <span>下移</span>
                  </button>
                )}
            </div>

            <div class="mh-action-list">
              <button
                type="button"
                class="mh-action-item"
                onClick={() => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({ type: "rename", target });
                }}
              >
                <span>重命名</span>
                <ObsidianIcon name="edit-3" size={18} />
              </button>
              <button
                type="button"
                class="mh-action-item is-danger"
                onClick={() => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({ type: "delete", target });
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
        open={promptAction !== null}
        title={
          promptAction?.type === "new-note"
            ? "新增笔记"
            : promptAction?.type === "new-folder"
              ? activeRootFolder
                ? "新增文件夹"
                : "新建知识库"
              : promptAction?.type === "rename"
                ? "重命名"
                : "确认删除"
        }
        placeholder={
          promptAction?.type === "new-note"
            ? "输入笔记名称"
            : promptAction?.type === "new-folder"
              ? "输入文件夹名称"
              : "输入新名称"
        }
        initialValue={
          promptAction?.type === "rename"
            ? promptAction.target instanceof TFile &&
              promptAction.target.extension === "md"
              ? promptAction.target.basename
              : promptAction.target.name
            : ""
        }
        message={
          promptAction?.type === "delete"
            ? `确定将「${promptAction.target.name}」移至回收站吗？`
            : undefined
        }
        confirmText={promptAction?.type === "delete" ? "删除" : "确定"}
        danger={promptAction?.type === "delete"}
        confirmOnly={promptAction?.type === "delete"}
        onCancel={() => setPromptAction(null)}
        onConfirm={executePrompt}
      />
    </div>
  );
}
