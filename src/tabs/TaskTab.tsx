import { useEffect, useMemo, useState } from "preact/hooks";
import { App, TFile, Notice } from "obsidian";
import { MobileHubSettings, TaskItem, TaskPriority } from "../types";
import {
  cleanMarkdownPreview,
  ensureFolder,
  formatDateKey,
  getMarkdownFilesInFolder,
  getUniqueFilePath,
  openFileInEditor,
  parseTaskFrontmatter,
  updateTaskFrontmatter,
} from "../utils/obsidian";
import { CalendarPanel } from "../components/CalendarPanel";
import { ObsidianIcon } from "../components/ObsidianIcon";
import { BottomSheet } from "../components/BottomSheet";
import { PromptModal } from "../components/PromptModal";

interface TaskTabProps {
  app: App;
  settings: MobileHubSettings;
  refreshTick: number;
}

const PRIORITY_ORDER: TaskPriority[] = ["low", "medium", "high"];
const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

function formatFriendlyDate(dateKey: string): string {
  if (!dateKey) return "无日期";
  const today = formatDateKey(new Date());
  if (dateKey === today) return "今天";
  const parts = dateKey.split("-").map(Number);
  if (parts.length === 3) {
    return `${parts[1]}月${parts[2]}日`;
  }
  return dateKey;
}

export function TaskTab({ app, settings, refreshTick }: TaskTabProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    formatDateKey(new Date())
  );
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const files = getMarkdownFilesInFolder(app, settings.taskFolder);
      const loaded: TaskItem[] = await Promise.all(
        files.map(async (f) => {
          const raw = await app.vault.cachedRead(f);
          const { due, done, priority } = parseTaskFrontmatter(app, f);
          const fallbackDue = due || formatDateKey(new Date(f.stat.ctime));
          const preview = cleanMarkdownPreview(raw, 6);
          const parentName = f.parent?.name || settings.taskFolder;
          return {
            path: f.path,
            basename: f.basename,
            due: fallbackDue,
            done,
            priority,
            preview,
            folderLabel: parentName === settings.taskFolder ? "收集箱" : parentName,
            mtime: f.stat.mtime,
          };
        })
      );

      loaded.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        const pDiff =
          PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority);
        if (pDiff !== 0) return pDiff;
        return b.mtime - a.mtime;
      });

      if (!cancelled) {
        setTasks(loaded);
        setLoading(false);
        setActiveTask((prev) =>
          prev ? loaded.find((t) => t.path === prev.path) ?? null : null
        );
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [app, settings.taskFolder, refreshTick]);

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) {
      if (t.due) set.add(t.due);
    }
    return set;
  }, [tasks]);

  const dayTasks = useMemo(() => {
    return tasks.filter((t) => t.due === selectedDate);
  }, [tasks, selectedDate]);

  const handleToggleDone = async (task: TaskItem, e?: Event) => {
    e?.stopPropagation();
    const file = app.vault.getAbstractFileByPath(task.path);
    if (!(file instanceof TFile)) return;
    const nextDone = !task.done;
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.path === task.path ? { ...t, done: nextDone } : t))
    );
    if (activeTask?.path === task.path) {
      setActiveTask({ ...task, done: nextDone });
    }
    await updateTaskFrontmatter(app, file, { done: nextDone });
  };

  const handleCyclePriority = async (task: TaskItem) => {
    const file = app.vault.getAbstractFileByPath(task.path);
    if (!(file instanceof TFile)) return;
    const nextIdx = (PRIORITY_ORDER.indexOf(task.priority) + 1) % PRIORITY_ORDER.length;
    const nextPriority = PRIORITY_ORDER[nextIdx];
    setActiveTask({ ...task, priority: nextPriority });
    setTasks((prev) =>
      prev.map((t) => (t.path === task.path ? { ...t, priority: nextPriority } : t))
    );
    await updateTaskFrontmatter(app, file, { priority: nextPriority });
  };

  const handleChangeDue = async (task: TaskItem, newDue: string) => {
    if (!newDue) return;
    const file = app.vault.getAbstractFileByPath(task.path);
    if (!(file instanceof TFile)) return;
    setActiveTask({ ...task, due: newDue });
    setTasks((prev) =>
      prev.map((t) => (t.path === task.path ? { ...t, due: newDue } : t))
    );
    await updateTaskFrontmatter(app, file, { due: newDue });
  };

  const handleOpenInNativeEditor = async (task: TaskItem) => {
    const file = app.vault.getAbstractFileByPath(task.path);
    setActiveTask(null);
    if (file instanceof TFile) {
      await openFileInEditor(app, file);
    }
  };

  const handleCreateTask = async (title: string) => {
    setCreateOpen(false);
    try {
      await ensureFolder(app, settings.taskFolder);
      const newPath = await getUniqueFilePath(app, settings.taskFolder, title, "md");
      const content = `---\ndue: ${selectedDate}\ndone: false\npriority: medium\n---\n\n`;
      const file = await app.vault.create(newPath, content);
      await openFileInEditor(app, file);
    } catch (err) {
      new Notice(`新建任务失败: ${String(err)}`);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;
    const file = app.vault.getAbstractFileByPath(deleteTarget.path);
    if (file instanceof TFile) {
      await app.vault.trash(file, true);
    }
    setDeleteTarget(null);
    setActiveTask(null);
  };

  const friendlySelected = formatFriendlyDate(selectedDate);

  return (
    <div class="mh-tab-page mh-task-page">
      <div class="mh-calendar-sticky">
        <CalendarPanel
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDates={markedDates}
          collapsible={false}
          weekStartsMonday={false}
        />
      </div>

      <div class="mh-task-body">
        {!loading && dayTasks.length === 0 ? (
          <div class="mh-empty-state">
            <ObsidianIcon name="check-circle-2" size={40} className="mh-empty-icon" />
            <div class="mh-empty-text">{friendlySelected}暂无任务</div>
          </div>
        ) : (
          <div class="mh-task-group-card">
            <div class="mh-task-group-header">{friendlySelected}</div>
            <div class="mh-task-list">
              {dayTasks.map((task) => (
                <div
                  key={task.path}
                  class={`mh-task-row ${task.done ? "is-done" : ""}`}
                  onClick={() => setActiveTask(task)}
                >
                  <button
                    type="button"
                    class={`mh-checkbox mh-priority-${task.priority} ${task.done ? "is-checked" : ""}`}
                    aria-label={task.done ? "标记为未完成" : "标记为已完成"}
                    onClick={(e) => handleToggleDone(task, e)}
                  >
                    {task.done && <ObsidianIcon name="check" size={13} />}
                  </button>
                  <div class="mh-task-main">
                    <div class="mh-task-title">{task.basename}</div>
                    <div class="mh-task-meta">
                      <span class="mh-task-due">{formatFriendlyDate(task.due)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        class="mh-fab"
        aria-label="新建任务"
        onClick={() => setCreateOpen(true)}
      >
        <ObsidianIcon name="plus" size={24} />
      </button>

      {/* TickTick-style half-screen detail drawer */}
      <BottomSheet
        open={activeTask !== null}
        onClose={() => setActiveTask(null)}
      >
        {activeTask && (
          <div class="mh-task-sheet">
            <div class="mh-task-sheet-topbar">
              <div class="mh-task-sheet-folder">
                <span>{activeTask.folderLabel}</span>
              </div>
              <div class="mh-task-sheet-actions">
                <button
                  type="button"
                  class={`mh-icon-btn mh-priority-flag mh-priority-${activeTask.priority}`}
                  title={`优先级：${PRIORITY_LABEL[activeTask.priority]}`}
                  onClick={() => handleCyclePriority(activeTask)}
                >
                  <ObsidianIcon name="flag" size={18} />
                </button>
                <button
                  type="button"
                  class="mh-icon-btn"
                  aria-label="删除任务"
                  onClick={() => setDeleteTarget(activeTask)}
                >
                  <ObsidianIcon name="trash-2" size={18} />
                </button>
              </div>
            </div>

            <div class="mh-task-sheet-date-row">
              <button
                type="button"
                class={`mh-checkbox mh-priority-${activeTask.priority} ${activeTask.done ? "is-checked" : ""}`}
                onClick={() => handleToggleDone(activeTask)}
              >
                {activeTask.done && <ObsidianIcon name="check" size={13} />}
              </button>
              <label class="mh-date-picker-label">
                <span>
                  {formatFriendlyDate(activeTask.due)}，{activeTask.due}
                </span>
                <input
                  type="date"
                  class="mh-hidden-date-input"
                  value={activeTask.due}
                  onChange={(e) =>
                    handleChangeDue(activeTask, (e.target as HTMLInputElement).value)
                  }
                />
              </label>
            </div>

            {/* Clicking this area expands into Obsidian's native MD editor */}
            <div
              class="mh-task-sheet-editor-trigger"
              role="button"
              onClick={() => handleOpenInNativeEditor(activeTask)}
            >
              <div class="mh-task-sheet-title">{activeTask.basename}</div>
              <div class="mh-task-sheet-desc">
                {activeTask.preview || "点击此处展开编辑正文描述..."}
              </div>
            </div>
          </div>
        )}
      </BottomSheet>

      <PromptModal
        open={createOpen}
        title="新建任务"
        placeholder="输入任务标题"
        confirmText="创建并编辑"
        onCancel={() => setCreateOpen(false)}
        onConfirm={handleCreateTask}
      />

      <PromptModal
        open={deleteTarget !== null}
        title="删除任务"
        message={`确定将任务「${deleteTarget?.basename ?? ""}」移至回收站吗？`}
        confirmText="删除"
        danger
        confirmOnly
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}
