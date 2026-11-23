import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { App, TFile, Notice } from "obsidian";
import {
  HubRuntimeState,
  MobileHubSettings,
  TaskItem,
  TaskPriority,
} from "../types";
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
  hubState: HubRuntimeState;
  refreshTick: number;
}

interface TaskMeta {
  file: TFile;
  due: string; // YYYY-MM-DD or ""
  done: boolean;
  priority: TaskPriority;
  folderLabel: string;
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

function addDays(base: Date, days: number): string {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
  return formatDateKey(d);
}

function sortTasks(list: TaskItem[]): TaskItem[] {
  return [...list].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const pDiff =
      PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority);
    if (pDiff !== 0) return pDiff;
    return b.mtime - a.mtime;
  });
}

export function TaskTab({ app, settings, hubState, refreshTick }: TaskTabProps) {
  const [selectedDate, setSelectedDateState] = useState<string>(
    () => hubState.taskSelectedDate
  );
  const [overdueOpen, setOverdueOpenState] = useState<boolean>(
    () => hubState.taskOverdueOpen
  );
  const [noDateOpen, setNoDateOpen] = useState(false);

  const [dayTasks, setDayTasks] = useState<TaskItem[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<TaskItem[]>([]);
  const [noDateTasks, setNoDateTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null);

  const bodyRef = useRef<HTMLDivElement>(null);
  const todayKey = formatDateKey(new Date());

  const setSelectedDate = (dateKey: string) => {
    setSelectedDateState(dateKey);
    hubState.taskSelectedDate = dateKey;
  };

  const setOverdueOpen = (next: boolean) => {
    setOverdueOpenState(next);
    hubState.taskOverdueOpen = next;
  };

  // Metadata-only scan (zero cachedRead) for calendar dots & bucketing
  const allMetas: TaskMeta[] = useMemo(() => {
    const files = getMarkdownFilesInFolder(app, settings.taskFolder);
    return files.map((file) => {
      const { due, done, priority } = parseTaskFrontmatter(app, file);
      const parentName = file.parent?.name || settings.taskFolder;
      return {
        file,
        due,
        done,
        priority,
        folderLabel: parentName,
      };
    });
  }, [app, settings.taskFolder, refreshTick]);

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    for (const m of allMetas) {
      if (m.due) set.add(m.due);
    }
    return set;
  }, [allMetas]);

  // Only cachedRead visible tasks (selected date + overdue + undated)
  useEffect(() => {
    let cancelled = false;

    const hydrate = async (metas: TaskMeta[]): Promise<TaskItem[]> => {
      const items = await Promise.all(
        metas.map(async (m) => {
          const raw = await app.vault.cachedRead(m.file);
          return {
            path: m.file.path,
            basename: m.file.basename,
            due: m.due,
            done: m.done,
            priority: m.priority,
            preview: cleanMarkdownPreview(raw, 6),
            folderLabel: m.folderLabel,
            mtime: m.file.stat.mtime,
          };
        })
      );
      return sortTasks(items);
    };

    const load = async () => {
      const dayMetas = allMetas.filter((m) => m.due === selectedDate);
      const overdueMetas = allMetas.filter(
        (m) => m.due !== "" && m.due < todayKey && !m.done && m.due !== selectedDate
      );
      const undatedMetas = allMetas.filter((m) => m.due === "" && !m.done);

      const [dayRes, overdueRes, undatedRes] = await Promise.all([
        hydrate(dayMetas),
        hydrate(overdueMetas),
        hydrate(undatedMetas),
      ]);

      if (!cancelled) {
        setDayTasks(dayRes);
        setOverdueTasks(overdueRes);
        setNoDateTasks(undatedRes);
        setLoading(false);

        const combined = [...dayRes, ...overdueRes, ...undatedRes];
        setActiveTask((prev) =>
          prev ? combined.find((t) => t.path === prev.path) ?? null : null
        );
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [app, allMetas, selectedDate, todayKey]);

  useEffect(() => {
    if (!loading && bodyRef.current && hubState.taskScrollTop > 0) {
      bodyRef.current.scrollTop = hubState.taskScrollTop;
    }
  }, [loading]);

  const patchTaskInLists = (path: string, patch: Partial<TaskItem>) => {
    const apply = (arr: TaskItem[]) =>
      arr.map((t) => (t.path === path ? { ...t, ...patch } : t));
    setDayTasks(apply);
    setOverdueTasks(apply);
    setNoDateTasks(apply);
    setActiveTask((prev) => (prev && prev.path === path ? { ...prev, ...patch } : prev));
  };

  const handleToggleDone = async (task: TaskItem, e?: Event) => {
    e?.stopPropagation();
    const file = app.vault.getAbstractFileByPath(task.path);
    if (!(file instanceof TFile)) return;
    const nextDone = !task.done;
    patchTaskInLists(task.path, { done: nextDone });
    await updateTaskFrontmatter(app, file, { done: nextDone });
  };

  const handleCyclePriority = async (task: TaskItem) => {
    const file = app.vault.getAbstractFileByPath(task.path);
    if (!(file instanceof TFile)) return;
    const nextIdx = (PRIORITY_ORDER.indexOf(task.priority) + 1) % PRIORITY_ORDER.length;
    const nextPriority = PRIORITY_ORDER[nextIdx];
    patchTaskInLists(task.path, { priority: nextPriority });
    await updateTaskFrontmatter(app, file, { priority: nextPriority });
  };

  const handleChangeDue = async (task: TaskItem, newDue: string) => {
    const file = app.vault.getAbstractFileByPath(task.path);
    if (!(file instanceof TFile)) return;
    patchTaskInLists(task.path, { due: newDue });
    await updateTaskFrontmatter(app, file, { due: newDue });
    setDatePickerOpen(false);
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
    try {
      if (file instanceof TFile) {
        await app.vault.trash(file, true);
        new Notice("已移至回收站");
      }
    } catch (err) {
      new Notice(`删除失败: ${String(err)}`);
    }
    setDeleteTarget(null);
    setActiveTask(null);
  };

  const renderTaskRow = (task: TaskItem, isOverdue = false) => (
    <div
      key={task.path}
      class={`mh-task-row ${task.done ? "is-done" : ""}`}
      onClick={() => setActiveTask(task)}
    >
      <button
        type="button"
        class={`mh-checkbox ${task.done ? "is-checked" : ""}`}
        aria-label={task.done ? "标记为未完成" : "标记为已完成"}
        onClick={(e) => handleToggleDone(task, e)}
      >
        {task.done && <ObsidianIcon name="check" size={13} />}
      </button>
      <div class="mh-task-main">
        <div class="mh-task-title">{task.basename}</div>
        <div class="mh-task-meta">
          <span class={`mh-task-due ${isOverdue ? "is-overdue" : ""}`}>
            {formatFriendlyDate(task.due)}
          </span>
        </div>
      </div>
    </div>
  );

  const friendlySelected = formatFriendlyDate(selectedDate);
  const hasAnyVisible =
    dayTasks.length > 0 || overdueTasks.length > 0 || noDateTasks.length > 0;

  return (
    <div class="mh-tab-page mh-task-page">
      <div class="mh-calendar-sticky">
        <CalendarPanel
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDates={markedDates}
          collapsible
          initialCollapsed={hubState.taskCollapsed}
          onCollapsedChange={(c) => {
            hubState.taskCollapsed = c;
          }}
          weekStartsMonday={settings.weekStartsMonday}
        />
      </div>

      <div
        ref={bodyRef}
        class="mh-task-body"
        onScroll={(e) => {
          hubState.taskScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
        }}
      >
        {!loading && !hasAnyVisible ? (
          <div class="mh-empty-state">
            <ObsidianIcon name="check-circle-2" size={40} className="mh-empty-icon" />
            <div class="mh-empty-text">{friendlySelected}暂无任务</div>
          </div>
        ) : (
          <div class="mh-task-groups">
            {/* Overdue tasks collapsible group */}
            {overdueTasks.length > 0 && (
              <div class="mh-task-group-card">
                <button
                  type="button"
                  class="mh-task-group-toggle is-overdue"
                  onClick={() => setOverdueOpen(!overdueOpen)}
                >
                  <span>已过期（{overdueTasks.length}）</span>
                  <ObsidianIcon
                    name={overdueOpen ? "chevron-down" : "chevron-right"}
                    size={16}
                  />
                </button>
                {overdueOpen && (
                  <div class="mh-task-list">
                    {overdueTasks.map((t) => renderTaskRow(t, true))}
                  </div>
                )}
              </div>
            )}

            {/* Selected date tasks */}
            <div class="mh-task-group-card">
              <div class="mh-task-group-header">{friendlySelected}</div>
              {dayTasks.length === 0 ? (
                <div class="mh-task-inline-empty">{friendlySelected}暂无任务</div>
              ) : (
                <div class="mh-task-list">
                  {dayTasks.map((t) => renderTaskRow(t))}
                </div>
              )}
            </div>

            {/* Undated tasks collapsible group */}
            {noDateTasks.length > 0 && (
              <div class="mh-task-group-card">
                <button
                  type="button"
                  class="mh-task-group-toggle"
                  onClick={() => setNoDateOpen(!noDateOpen)}
                >
                  <span>无日期（{noDateTasks.length}）</span>
                  <ObsidianIcon
                    name={noDateOpen ? "chevron-down" : "chevron-right"}
                    size={16}
                  />
                </button>
                {noDateOpen && (
                  <div class="mh-task-list">
                    {noDateTasks.map((t) => renderTaskRow(t))}
                  </div>
                )}
              </div>
            )}
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
        open={activeTask !== null && !datePickerOpen}
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
                class={`mh-checkbox ${activeTask.done ? "is-checked" : ""}`}
                onClick={() => handleToggleDone(activeTask)}
              >
                {activeTask.done && <ObsidianIcon name="check" size={13} />}
              </button>
              <button
                type="button"
                class="mh-date-trigger-btn"
                onClick={() => setDatePickerOpen(true)}
              >
                <ObsidianIcon name="calendar" size={15} />
                <span>
                  {activeTask.due
                    ? `${formatFriendlyDate(activeTask.due)}，${activeTask.due}`
                    : "设置日期"}
                </span>
              </button>
            </div>

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

      {/* Custom WebView-safe Date Picker Drawer (replaces native input[type=date]) */}
      <BottomSheet
        open={datePickerOpen && activeTask !== null}
        onClose={() => setDatePickerOpen(false)}
        showCancel
      >
        {activeTask && (
          <div class="mh-date-picker-sheet">
            <div class="mh-quick-grid">
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => handleChangeDue(activeTask, todayKey)}
              >
                <ObsidianIcon name="sun" size={20} />
                <span>今天</span>
              </button>
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => handleChangeDue(activeTask, addDays(new Date(), 1))}
              >
                <ObsidianIcon name="sunrise" size={20} />
                <span>明天</span>
              </button>
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => handleChangeDue(activeTask, addDays(new Date(), 7))}
              >
                <ObsidianIcon name="calendar-days" size={20} />
                <span>下周</span>
              </button>
              <button
                type="button"
                class="mh-quick-tile"
                onClick={() => handleChangeDue(activeTask, "")}
              >
                <ObsidianIcon name="x-circle" size={20} />
                <span>清除日期</span>
              </button>
            </div>
            <div class="mh-date-picker-cal">
              <CalendarPanel
                selectedDate={activeTask.due || todayKey}
                onSelectDate={(d) => handleChangeDue(activeTask, d)}
                markedDates={markedDates}
                collapsible={false}
                weekStartsMonday={settings.weekStartsMonday}
              />
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
