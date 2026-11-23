import { ItemView, WorkspaceLeaf } from "obsidian";
import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type MobileHubPlugin from "../main";
import { HubTabId, MobileHubSettings } from "../types";
import { openObsidianSettings, openObsidianSwitcher } from "../utils/obsidian";
import { ObsidianIcon } from "../components/ObsidianIcon";
import { MemoTab } from "../tabs/MemoTab";
import { DiaryTab } from "../tabs/DiaryTab";
import { TaskTab } from "../tabs/TaskTab";
import { KnowledgeTab } from "../tabs/KnowledgeTab";

export const VIEW_TYPE_MOBILE_HUB = "obsidian-mobile-hub-view";

const TABS: { id: HubTabId; label: string }[] = [
  { id: "memo", label: "备忘录" },
  { id: "diary", label: "日记" },
  { id: "task", label: "任务" },
  { id: "knowledge", label: "知识库" },
];

interface MobileHubRootProps {
  plugin: MobileHubPlugin;
  subscribeRefresh: (cb: () => void) => () => void;
}

function MobileHubRoot({ plugin, subscribeRefresh }: MobileHubRootProps) {
  const [activeTab, setActiveTab] = useState<HubTabId>(plugin.hubState.lastTab);
  const [kbInSubPage, setKbInSubPage] = useState<boolean>(
    Boolean(plugin.hubState.kbRootPath)
  );
  const [refreshTick, setRefreshTick] = useState(0);
  const [settings, setSettings] = useState<MobileHubSettings>(() => ({
    ...plugin.settings,
  }));

  useEffect(() => {
    return subscribeRefresh(() => {
      setSettings({ ...plugin.settings });
      setRefreshTick((t) => t + 1);
    });
  }, [plugin, subscribeRefresh]);

  const selectTab = (tab: HubTabId) => {
    setActiveTab(tab);
    plugin.hubState.lastTab = tab;
  };

  const handleUpdateCustomOrder = async (
    folderPath: string,
    orderedNames: string[]
  ) => {
    plugin.settings.customOrder[folderPath] = orderedNames;
    await plugin.saveSettings();
    setSettings({ ...plugin.settings });
    setRefreshTick((t) => t + 1);
  };

  const handleReplaceCustomOrderMap = async (
    nextMap: Record<string, string[]>
  ) => {
    plugin.settings.customOrder = nextMap;
    await plugin.saveSettings();
    setSettings({ ...plugin.settings });
    setRefreshTick((t) => t + 1);
  };

  const hideMainTopbar = activeTab === "knowledge" && kbInSubPage;
  const tabSwipeStart = useRef<{ x: number; y: number; inCalendar: boolean } | null>(
    null
  );

  const handleRootTouchStart = (e: TouchEvent) => {
    // Prevent Obsidian Mobile's outer left/right drawer listeners from seeing touches inside Mobile Hub
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest(".mh-sheet-backdrop, .mh-modal-backdrop, .mh-lightbox-backdrop")) {
      tabSwipeStart.current = null;
      return;
    }
    tabSwipeStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      inCalendar: Boolean(target?.closest(".mh-calendar")),
    };
  };

  const handleRootTouchMove = (e: TouchEvent) => {
    // Always stop propagation to block native left (file) and right (backlinks) drawers
    e.stopPropagation();
  };

  const handleRootTouchEnd = (e: TouchEvent) => {
    e.stopPropagation();
    if (!tabSwipeStart.current || e.changedTouches.length !== 1) return;
    const start = tabSwipeStart.current;
    tabSwipeStart.current = null;

    // Do not switch tabs if swiping inside calendar or inside Knowledge Base subpage
    if (start.inCalendar || hideMainTopbar) return;

    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      const idx = TABS.findIndex((t) => t.id === activeTab);
      if (dx < 0 && idx < TABS.length - 1) {
        selectTab(TABS[idx + 1].id);
      } else if (dx > 0 && idx > 0) {
        selectTab(TABS[idx - 1].id);
      }
    }
  };

  return (
    <div
      class="mh-root"
      data-active-tab={activeTab}
      onTouchStart={handleRootTouchStart}
      onTouchMove={handleRootTouchMove}
      onTouchEnd={handleRootTouchEnd}
    >
      {!hideMainTopbar && (
        <header class="mh-topbar">
          <button
            type="button"
            class="mh-settings-circle-btn"
            aria-label="打开设置"
            onClick={() => openObsidianSettings(plugin.app)}
          >
            <ObsidianIcon name="settings" size={19} />
          </button>

          <nav class="mh-tabs" role="tablist" aria-label="主导航">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                class={`mh-tab-btn ${activeTab === t.id ? "is-active" : ""}`}
                onClick={() => selectTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {activeTab !== "knowledge" && (
            <button
              type="button"
              class="mh-icon-btn mh-topbar-search-btn"
              aria-label="全局搜索"
              onClick={() => openObsidianSwitcher(plugin.app)}
            >
              <ObsidianIcon name="search" size={19} />
            </button>
          )}
        </header>
      )}

      <main class="mh-content">
        {activeTab === "memo" && (
          <MemoTab
            app={plugin.app}
            settings={settings}
            hubState={plugin.hubState}
            refreshTick={refreshTick}
          />
        )}
        {activeTab === "diary" && (
          <DiaryTab
            app={plugin.app}
            settings={settings}
            hubState={plugin.hubState}
            refreshTick={refreshTick}
          />
        )}
        {activeTab === "task" && (
          <TaskTab
            app={plugin.app}
            settings={settings}
            hubState={plugin.hubState}
            refreshTick={refreshTick}
          />
        )}
        {activeTab === "knowledge" && (
          <KnowledgeTab
            app={plugin.app}
            settings={settings}
            hubState={plugin.hubState}
            refreshTick={refreshTick}
            onRootPathChange={(path) => {
              plugin.hubState.kbRootPath = path;
              setKbInSubPage(Boolean(path));
            }}
            onUpdateCustomOrder={handleUpdateCustomOrder}
            onReplaceCustomOrderMap={handleReplaceCustomOrderMap}
          />
        )}
      </main>
    </div>
  );
}

export class MobileHubView extends ItemView {
  private plugin: MobileHubPlugin;
  private listeners = new Set<() => void>();

  constructor(leaf: WorkspaceLeaf, plugin: MobileHubPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_MOBILE_HUB;
  }

  getDisplayText(): string {
    return "Mobile Hub";
  }

  getIcon(): string {
    return "layout-grid";
  }

  triggerRefresh(): void {
    for (const cb of this.listeners) {
      cb();
    }
  }

  async onOpen(): Promise<void> {
    this.plugin.syncBodyClasses(this.leaf);
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    container.addClass("mh-view-container");

    render(
      <MobileHubRoot
        plugin={this.plugin}
        subscribeRefresh={(cb) => {
          this.listeners.add(cb);
          return () => this.listeners.delete(cb);
        }}
      />,
      container
    );
  }

  async onClose(): Promise<void> {
    const container = this.containerEl.children[1] as HTMLElement;
    if (container) {
      render(null, container);
    }
    this.listeners.clear();
  }
}
