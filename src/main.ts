import {
  App,
  Platform,
  Plugin,
  PluginSettingTab,
  Setting,
  TAbstractFile,
  TFile,
  WorkspaceLeaf,
  normalizePath,
  setIcon,
} from "obsidian";
import {
  DEFAULT_SETTINGS,
  HubRuntimeState,
  MobileHubSettings,
} from "./types";
import { MobileHubView, VIEW_TYPE_MOBILE_HUB } from "./views/MobileHubView";
import { formatDateKey, stripFrontmatter } from "./utils/obsidian";

export default class MobileHubPlugin extends Plugin {
  settings: MobileHubSettings = { ...DEFAULT_SETTINGS };
  pendingDraftPath: string | null = null;
  hubState: HubRuntimeState = {
    lastTab: "memo",
    memoScrollTop: 0,
    diarySelectedDate: formatDateKey(new Date()),
    diaryCollapsed: false,
    diaryScrollTop: 0,
    taskSelectedDate: formatDateKey(new Date()),
    taskCollapsed: false,
    taskScrollTop: 0,
    taskOverdueOpen: true,
    kbRootPath: null,
    kbExpandedPaths: [],
    kbScrollTop: 0,
  };

  private refreshTimer: number | null = null;
  private editorBackBarEl: HTMLElement | null = null;
  private touchStartX = 0;
  private touchStartY = 0;
  private boundTouchStart: ((e: TouchEvent) => void) | null = null;
  private boundTouchMove: ((e: TouchEvent) => void) | null = null;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_MOBILE_HUB,
      (leaf) => new MobileHubView(leaf, this)
    );

    this.addCommand({
      id: "open-mobile-hub",
      name: "打开 Mobile Hub 主界面",
      callback: () => this.activateHubView(),
    });

    this.addRibbonIcon("layout-grid", "Mobile Hub", () => {
      this.activateHubView();
    });

    this.addSettingTab(new MobileHubSettingTab(this.app, this));

    // Sync body class when active leaf or layout changes (handles same-leaf view swaps)
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        this.syncBodyClasses(leaf);
      })
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.syncBodyClasses(this.app.workspace.activeLeaf);
      })
    );

    // Filter vault events by current active tab's relevant folder to avoid unnecessary re-renders on large vaults
    const scheduleRefreshForFile = (file?: TAbstractFile | string) => {
      const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOBILE_HUB);
      if (leaves.length === 0) return;

      if (file) {
        const path = typeof file === "string" ? file : file.path;
        if (!this.isPathRelevantToActiveTab(path)) return;
      }

      if (this.refreshTimer !== null) {
        window.clearTimeout(this.refreshTimer);
      }
      this.refreshTimer = window.setTimeout(() => {
        this.refreshTimer = null;
        this.refreshAllHubViews();
      }, 160);
    };

    this.registerEvent(this.app.vault.on("create", (f) => scheduleRefreshForFile(f)));
    this.registerEvent(this.app.vault.on("delete", (f) => scheduleRefreshForFile(f)));
    this.registerEvent(
      this.app.vault.on("rename", (f, oldPath) => {
        if (
          this.isPathRelevantToActiveTab(f.path) ||
          this.isPathRelevantToActiveTab(oldPath)
        ) {
          scheduleRefreshForFile();
        }
      })
    );
    this.registerEvent(this.app.vault.on("modify", (f) => scheduleRefreshForFile(f)));
    this.registerEvent(
      this.app.metadataCache.on("changed", (f) => scheduleRefreshForFile(f))
    );

    this.installLeftSwipeBlocker();
    this.mountEditorBackBar();

    this.app.workspace.onLayoutReady(() => {
      const isMobileMode =
        Platform.isMobile || document.body.classList.contains("is-mobile");
      if (this.settings.autoOpenOnMobile && isMobileMode) {
        this.activateHubView();
      }
      this.syncBodyClasses(this.app.workspace.activeLeaf);
    });
  }

  onunload(): void {
    document.body.classList.remove(
      "mh-hub-active",
      "mh-editor-active",
      "mh-disable-left-drawer"
    );
    this.editorBackBarEl?.remove();
    this.editorBackBarEl = null;
    this.uninstallLeftSwipeBlocker();
    if (this.refreshTimer !== null) {
      window.clearTimeout(this.refreshTimer);
    }
  }

  private isPathRelevantToActiveTab(rawPath: string): boolean {
    const p = normalizePath(rawPath);
    const tab = this.hubState.lastTab;
    const memoPrefix = `${normalizePath(this.settings.memoFolder)}/`;
    const diaryPrefix = `${normalizePath(this.settings.diaryFolder)}/`;
    const taskPrefix = `${normalizePath(this.settings.taskFolder)}/`;

    if (tab === "memo") return p === this.settings.memoFolder || p.startsWith(memoPrefix);
    if (tab === "diary") return p === this.settings.diaryFolder || p.startsWith(diaryPrefix);
    if (tab === "task") return p === this.settings.taskFolder || p.startsWith(taskPrefix);
    // Knowledge tab excludes memo/diary/task
    return (
      !p.startsWith(memoPrefix) &&
      !p.startsWith(diaryPrefix) &&
      !p.startsWith(taskPrefix)
    );
  }

  private mountEditorBackBar(): void {
    if (this.editorBackBarEl) return;
    const bar = document.createElement("div");
    bar.className = "mh-editor-backbar";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mh-editor-back-btn";
    btn.setAttribute("aria-label", "返回");
    setIcon(btn, "chevron-left");
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
    }
    btn.addEventListener("click", async () => {
      await this.cleanupEmptyDraftIfNeeded();
      await this.activateHubView();
    });

    bar.appendChild(btn);
    document.body.appendChild(bar);
    this.editorBackBarEl = bar;
  }

  syncBodyClasses(activeLeaf: WorkspaceLeaf | null): void {
    const viewType = activeLeaf?.view?.getViewType();
    const isHubActive = viewType === VIEW_TYPE_MOBILE_HUB;
    const isEditorActive = viewType === "markdown";

    document.body.classList.toggle("mh-hub-active", Boolean(isHubActive));
    document.body.classList.toggle("mh-editor-active", Boolean(isEditorActive));
    document.body.classList.toggle(
      "mh-disable-left-drawer",
      this.settings.disableLeftDrawerSwipe
    );
  }

  /**
   * Intercept ONLY left-edge right-swipe gestures (<= 32px from left edge) while on Mobile Hub view.
   * Never blocks editor text selection, wide tables, or calendar horizontal swipes.
   */
  private installLeftSwipeBlocker(): void {
    this.boundTouchStart = (e: TouchEvent) => {
      if (!this.settings.disableLeftDrawerSwipe) return;
      if (e.touches.length !== 1) return;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    };

    this.boundTouchMove = (e: TouchEvent) => {
      if (!this.settings.disableLeftDrawerSwipe) return;
      if (!document.body.classList.contains("is-mobile")) return;
      if (!document.body.classList.contains("mh-hub-active")) return;
      if (e.touches.length !== 1) return;
      // Only intercept swipes starting from the left edge (<= 32px)
      if (this.touchStartX > 32) return;

      const dx = e.touches[0].clientX - this.touchStartX;
      const dy = e.touches[0].clientY - this.touchStartY;
      if (dx > 10 && Math.abs(dx) > Math.abs(dy) * 1.1) {
        const leftSplit = this.app.workspace.leftSplit as unknown as {
          collapsed?: boolean;
        };
        if (leftSplit?.collapsed !== false) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("touchstart", this.boundTouchStart, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchmove", this.boundTouchMove, {
      capture: true,
      passive: true,
    });
  }

  private uninstallLeftSwipeBlocker(): void {
    if (this.boundTouchStart) {
      window.removeEventListener("touchstart", this.boundTouchStart, {
        capture: true,
      });
      this.boundTouchStart = null;
    }
    if (this.boundTouchMove) {
      window.removeEventListener("touchmove", this.boundTouchMove, {
        capture: true,
      });
      this.boundTouchMove = null;
    }
  }

  async cleanupEmptyDraftIfNeeded(): Promise<void> {
    const draftPath = this.pendingDraftPath;
    if (!draftPath) return;
    this.pendingDraftPath = null;

    const af = this.app.vault.getAbstractFileByPath(draftPath);
    if (!(af instanceof TFile)) return;

    try {
      const content = await this.app.vault.read(af);
      const body = stripFrontmatter(content).trim();
      if (!body) {
        await this.app.vault.delete(af);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  async activateHubView(): Promise<void> {
    await this.cleanupEmptyDraftIfNeeded();
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOBILE_HUB);
    let leaf: WorkspaceLeaf;
    if (existing.length > 0) {
      leaf = existing[0];
    } else {
      leaf = this.app.workspace.getLeaf(false);
      await leaf.setViewState({
        type: VIEW_TYPE_MOBILE_HUB,
        active: true,
      });
    }
    this.app.workspace.revealLeaf(leaf);
    if (this.settings.disableLeftDrawerSwipe) {
      const leftSplit = this.app.workspace.leftSplit as unknown as {
        collapse?: () => void;
      };
      const rightSplit = this.app.workspace.rightSplit as unknown as {
        collapse?: () => void;
      };
      leftSplit?.collapse?.();
      rightSplit?.collapse?.();
    }
    this.syncBodyClasses(leaf);
  }

  refreshAllHubViews(): void {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOBILE_HUB);
    for (const leaf of leaves) {
      if (leaf.view instanceof MobileHubView) {
        leaf.view.triggerRefresh();
      }
    }
  }

  async loadSettings(): Promise<void> {
    const loaded = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    if (!this.settings.customOrder) {
      this.settings.customOrder = {};
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.syncBodyClasses(this.app.workspace.activeLeaf);
    this.refreshAllHubViews();
  }
}

class MobileHubSettingTab extends PluginSettingTab {
  plugin: MobileHubPlugin;

  constructor(app: App, plugin: MobileHubPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Mobile Hub 设置" });

    new Setting(containerEl)
      .setName("备忘录文件夹")
      .setDesc("备忘录 Tab 读取的数据目录")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.memoFolder)
          .onChange(async (val) => {
            this.plugin.settings.memoFolder = val.trim() || "备忘录";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("日记文件夹")
      .setDesc("日记 Tab 读取的数据目录")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.diaryFolder)
          .onChange(async (val) => {
            this.plugin.settings.diaryFolder = val.trim() || "日记";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("任务文件夹")
      .setDesc("任务 Tab 读取的数据目录")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.taskFolder)
          .onChange(async (val) => {
            this.plugin.settings.taskFolder = val.trim() || "任务";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("知识库排除文件夹")
      .setDesc("逗号分隔，不显示在知识库列表中的根目录文件夹")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.excludedFolders.join(", "))
          .onChange(async (val) => {
            this.plugin.settings.excludedFolders = val
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("日历每周以周一开始")
      .setDesc("日记与任务 Tab 的日历统一生效")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.weekStartsMonday)
          .onChange(async (val) => {
            this.plugin.settings.weekStartsMonday = val;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("移动端启动时自动打开主界面")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoOpenOnMobile)
          .onChange(async (val) => {
            this.plugin.settings.autoOpenOnMobile = val;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("禁用从左边缘向右滑动拉出左侧抽屉")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.disableLeftDrawerSwipe)
          .onChange(async (val) => {
            this.plugin.settings.disableLeftDrawerSwipe = val;
            await this.plugin.saveSettings();
          })
      );
  }
}
