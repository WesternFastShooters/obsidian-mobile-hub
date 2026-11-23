export type HubTabId = "memo" | "diary" | "task" | "knowledge";

export type TaskPriority = "low" | "medium" | "high";

export interface MobileHubSettings {
  memoFolder: string;
  diaryFolder: string;
  taskFolder: string;
  excludedFolders: string[];
  autoOpenOnMobile: boolean;
  disableLeftDrawerSwipe: boolean;
  /** Folder path -> ordered child names (file/folder basename) */
  customOrder: Record<string, string[]>;
}

export const DEFAULT_SETTINGS: MobileHubSettings = {
  memoFolder: "备忘录",
  diaryFolder: "日记",
  taskFolder: "任务",
  excludedFolders: ["assets", ".obsidian"],
  autoOpenOnMobile: true,
  disableLeftDrawerSwipe: true,
  customOrder: {},
};

export interface MemoItem {
  path: string;
  basename: string;
  preview: string;
  timeText: string;
  mtime: number;
  ctime: number;
}

export interface DiaryItem {
  path: string;
  basename: string;
  dateKey: string; // YYYY-MM-DD
  timeText: string; // HH:mm
  sortKey: number;
  preview: string;
  images: string[]; // resolved resource URLs
}

export interface TaskItem {
  path: string;
  basename: string; // title
  due: string; // YYYY-MM-DD or ""
  done: boolean;
  priority: TaskPriority;
  preview: string;
  folderLabel: string;
  mtime: number;
}

export interface KnowledgeRootItem {
  path: string;
  name: string;
  docCount: number;
  latestMtime: number;
  latestTimeText: string;
}
