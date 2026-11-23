import { App, TAbstractFile, TFile, TFolder, normalizePath } from "obsidian";
import { TaskPriority } from "../types";

export function openObsidianSettings(app: App): void {
  const anyApp = app as unknown as {
    commands?: { executeCommandById?: (id: string) => void };
    setting?: { open?: () => void };
  };
  if (anyApp.setting?.open) {
    anyApp.setting.open();
    return;
  }
  anyApp.commands?.executeCommandById?.("app:open-settings");
}

export function openObsidianSwitcher(app: App): void {
  const anyApp = app as unknown as {
    commands?: { executeCommandById?: (id: string) => void };
  };
  anyApp.commands?.executeCommandById?.("switcher:open");
}

export async function openFileInEditor(app: App, file: TFile): Promise<void> {
  const leaf = app.workspace.getLeaf(false);
  await leaf.openFile(file, { active: true });
}

export async function ensureFolder(app: App, folderPath: string): Promise<TFolder> {
  const normalized = normalizePath(folderPath);
  const existing = app.vault.getAbstractFileByPath(normalized);
  if (existing instanceof TFolder) return existing;
  await app.vault.createFolder(normalized);
  const created = app.vault.getAbstractFileByPath(normalized);
  if (created instanceof TFolder) return created;
  throw new Error(`Failed to create folder: ${normalized}`);
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function formatShortDateTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (d.getFullYear() === now.getFullYear()) {
    return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
  return formatDateTime(ts);
}

export function stripFrontmatter(content: string): string {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith("---")) return content.trim();
  const endIdx = trimmed.indexOf("\n---", 3);
  if (endIdx === -1) return content.trim();
  return trimmed.slice(endIdx + 4).trim();
}

export function cleanMarkdownPreview(content: string, maxLines = 8): string {
  const body = stripFrontmatter(content)
    // Remove image embeds and stray object-replacement characters
    .replace(/!\[\[[^\]]+\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\uFFFC/g, "")
    .trim();
  if (!body) return "";
  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l, idx, arr) => l.length > 0 || (idx > 0 && arr[idx - 1].length > 0));
  return lines.slice(0, maxLines).join("\n");
}

export function extractImagesFromContent(
  app: App,
  content: string,
  sourcePath: string,
  limit = 3
): string[] {
  const urls: string[] = [];
  const wikiImgRegex = /!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const mdImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;

  const tryAdd = (link: string) => {
    if (urls.length >= limit) return;
    const cleaned = link.trim();
    if (!cleaned) return;
    if (/^https?:\/\//i.test(cleaned)) {
      urls.push(cleaned);
      return;
    }
    const resolved = app.metadataCache.getFirstLinkpathDest(cleaned, sourcePath);
    if (resolved instanceof TFile) {
      urls.push(app.vault.getResourcePath(resolved));
    }
  };

  let match: RegExpExecArray | null;
  while ((match = wikiImgRegex.exec(content)) !== null) {
    tryAdd(match[1]);
    if (urls.length >= limit) return urls;
  }
  while ((match = mdImgRegex.exec(content)) !== null) {
    tryAdd(match[1]);
    if (urls.length >= limit) return urls;
  }
  return urls;
}

/**
 * Resolve diary date & time with 3-tier priority:
 * 1. Frontmatter `date` / `created`
 * 2. Filename pattern: YYYY-MM-DD[ HH-mm | HH:mm | _HH-mm]
 * 3. File ctime fallback
 */
export function resolveDiaryDateTime(
  app: App,
  file: TFile
): { dateKey: string; timeText: string; sortKey: number } {
  const cache = app.metadataCache.getFileCache(file);
  const fm = cache?.frontmatter;
  const fmRaw = fm?.date ?? fm?.created;

  if (fmRaw !== undefined && fmRaw !== null) {
    const parsed = parseDateTimeString(String(fmRaw));
    if (parsed) return parsed;
  }

  const fromName = parseDateTimeString(file.basename);
  if (fromName) return fromName;

  const d = new Date(file.stat.ctime);
  return {
    dateKey: formatDateKey(d),
    timeText: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
    sortKey: d.getTime(),
  };
}

export function parseDateTimeString(
  raw: string
): { dateKey: string; timeText: string; sortKey: number } | null {
  const str = raw.trim();
  const m = str.match(
    /(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s_]+(\d{1,2})[:\-._](\d{1,2}))?/
  );
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = m[4] !== undefined ? Number(m[4]) : 0;
  const minute = m[5] !== undefined ? Number(m[5]) : 0;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day, hour, minute, 0, 0);
  return {
    dateKey: `${year}-${pad2(month)}-${pad2(day)}`,
    timeText: `${pad2(hour)}:${pad2(minute)}`,
    sortKey: d.getTime(),
  };
}

export function getFilesInFolderRecursive(folder: TFolder): TFile[] {
  const result: TFile[] = [];
  const walk = (f: TFolder) => {
    for (const child of f.children) {
      if (child instanceof TFile) {
        result.push(child);
      } else if (child instanceof TFolder) {
        walk(child);
      }
    }
  };
  walk(folder);
  return result;
}

export function getMarkdownFilesInFolder(app: App, folderPath: string): TFile[] {
  const normalized = normalizePath(folderPath);
  const target = app.vault.getAbstractFileByPath(normalized);
  if (!(target instanceof TFolder)) return [];
  return getFilesInFolderRecursive(target).filter((f) => f.extension === "md");
}

export function parseTaskFrontmatter(
  app: App,
  file: TFile
): { due: string; done: boolean; priority: TaskPriority } {
  const fm = app.metadataCache.getFileCache(file)?.frontmatter;
  let due = "";
  if (fm?.due) {
    const parsed = parseDateTimeString(String(fm.due));
    due = parsed ? parsed.dateKey : String(fm.due).slice(0, 10);
  }
  const done = fm?.done === true || fm?.done === "true";
  const rawP = String(fm?.priority ?? "medium").toLowerCase();
  const priority: TaskPriority =
    rawP === "high" || rawP === "low" || rawP === "medium" ? rawP : "medium";
  return { due, done, priority };
}

export async function updateTaskFrontmatter(
  app: App,
  file: TFile,
  patch: Partial<{ due: string; done: boolean; priority: TaskPriority }>
): Promise<void> {
  await app.fileManager.processFrontMatter(file, (fm) => {
    if (patch.due !== undefined) fm.due = patch.due;
    if (patch.done !== undefined) fm.done = patch.done;
    if (patch.priority !== undefined) fm.priority = patch.priority;
  });
}

export async function getUniqueFilePath(
  app: App,
  folderPath: string,
  baseName: string,
  ext = "md"
): Promise<string> {
  const cleanFolder = folderPath ? normalizePath(folderPath) : "";
  const prefix = cleanFolder ? `${cleanFolder}/` : "";
  const suffix = ext ? `.${ext}` : "";
  let candidate = normalizePath(`${prefix}${baseName}${suffix}`);
  let idx = 1;
  while (app.vault.getAbstractFileByPath(candidate)) {
    candidate = normalizePath(`${prefix}${baseName} ${idx}${suffix}`);
    idx++;
  }
  return candidate;
}

export function sortChildrenWithCustomOrder(
  children: TAbstractFile[],
  orderList?: string[]
): TAbstractFile[] {
  const orderMap = new Map<string, number>();
  if (orderList) {
    orderList.forEach((name, idx) => orderMap.set(name, idx));
  }
  return [...children].sort((a, b) => {
    const ia = orderMap.has(a.name) ? orderMap.get(a.name)! : Number.MAX_SAFE_INTEGER;
    const ib = orderMap.has(b.name) ? orderMap.get(b.name)! : Number.MAX_SAFE_INTEGER;
    if (ia !== ib) return ia - ib;
    // Default: folders first, then alphabetical
    const aIsFolder = a instanceof TFolder ? 0 : 1;
    const bIsFolder = b instanceof TFolder ? 0 : 1;
    if (aIsFolder !== bIsFolder) return aIsFolder - bIsFolder;
    return a.name.localeCompare(b.name, "zh-CN");
  });
}

export function isDescendantPath(parentPath: string, childPath: string): boolean {
  const normParent = normalizePath(parentPath);
  const normChild = normalizePath(childPath);
  return normChild === normParent || normChild.startsWith(`${normParent}/`);
}
