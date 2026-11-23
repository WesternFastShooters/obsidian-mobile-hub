import { ItemView, WorkspaceLeaf } from "obsidian";
import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type MobileHubPlugin from "../main";
import { HubTab, MobileHubSettings } from "../types";
import { openObsidianSettings, openObsidianSwitcher } from "../utils/obsidian";
import { ObsidianIcon } from "../components/ObsidianIcon";
import { MemoTab } from "../tabs/MemoTab";
import { DiaryTab } from "../tabs/DiaryTab";
import { KnowledgeTab } from "../tabs/KnowledgeTab";

export const VIEW_TYPE_MOBILE_HUB = "obsidian-mobile-hub-view";

const TABS: { id: HubTab; label: string }[] = [
  { id: HubTab.Memo, label: "备忘录" },
  { id: HubTab.Diary, label: "日记" },
  { id: HubTab.Knowledge, label: "知识库" },
];

interface MobileHubRootProps {
  plugin: MobileHubPlugin;
  subscribeRefresh: (cb: () => void) => () => void;
}

function MobileHubRoot({ plugin, subscribeRefresh }: MobileHubRootProps) {
  const [activeTab, setActiveTab] = useState<HubTab>(plugin.hubState.lastTab);
  const [kbInSubPage, setKbInSubPage] = useState<boolean>(
    Boolean(plugin.hubState.kbRootPath)
  );
  const [refreshTick, setRefreshTick] = useState(0);
  const [settings, setSettings] = useState<MobileHubSettings>(() => ({
    ...plugin.settings,
  }));

  // Lazy-mount tabs so startup stays fast, while mounting adjacent tab immediately on swipe
  const [mountedTabs, setMountedTabs] = useState<Set<HubTab>>(
    () => new Set([plugin.hubState.lastTab])
  );

  // Interactive ViewPager drag state
  const [dragDx, setDragDx] = useState(0);
  const [isDraggingPager, setIsDraggingPager] = useState(false);

  const pagerRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    locked: "none" | "horizontal" | "vertical";
    blocked: boolean;
  } | null>(null);

  useEffect(() => {
    return subscribeRefresh(() => {
      setSettings({ ...plugin.settings });
      setRefreshTick((t) => t + 1);
    });
  }, [plugin, subscribeRefresh]);

  const ensureMounted = (tab: HubTab) => {
    setMountedTabs((prev) => {
      if (prev.has(tab)) return prev;
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
  };

  const selectTab = (tab: HubTab) => {
    ensureMounted(tab);
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

  const hideMainTopbar = activeTab === HubTab.Knowledge && kbInSubPage;
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.id === activeTab)
  );

  const handleRootTouchStart = (e: TouchEvent) => {
    // Block Obsidian Mobile's outer left/right drawer listeners
    e.stopPropagation();
    if (e.touches.length !== 1) return;

    const target = e.target as HTMLElement | null;
    const blocked =
      hideMainTopbar ||
      Boolean(
        target?.closest(
          ".mh-calendar, .mh-sheet-backdrop, .mh-modal-backdrop, .mh-lightbox-backdrop, .mh-kb-tree-view.is-dragging"
        )
      );

    swipeRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startTime: Date.now(),
      locked: "none",
      blocked,
    };
  };

  const handleRootTouchMove = (e: TouchEvent) => {
    e.stopPropagation();
    const s = swipeRef.current;
    if (!s || s.blocked || e.touches.length !== 1) return;

    const dx = e.touches[0].clientX - s.startX;
    const dy = e.touches[0].clientY - s.startY;

    if (s.locked === "none") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) > Math.abs(dy) * 1.15) {
        s.locked = "horizontal";
        setIsDraggingPager(true);
        // Pre-mount neighbor tab in swipe direction so it slides in live
        if (dx < 0 && activeIndex < TABS.length - 1) {
          ensureMounted(TABS[activeIndex + 1].id);
        } else if (dx > 0 && activeIndex > 0) {
          ensureMounted(TABS[activeIndex - 1].id);
        }
      } else {
        s.locked = "vertical";
        return;
      }
    }

    if (s.locked === "horizontal") {
      // Rubber-band damping at first/last tab edges
      let effectiveDx = dx;
      if (
        (activeIndex === 0 && dx > 0) ||
        (activeIndex === TABS.length - 1 && dx < 0)
      ) {
        effectiveDx = dx * 0.25;
      }
      setDragDx(effectiveDx);
    }
  };

  const handleRootTouchEnd = (e: TouchEvent) => {
    e.stopPropagation();
    const s = swipeRef.current;
    swipeRef.current = null;

    if (!s || s.locked !== "horizontal") {
      if (isDraggingPager) {
        setIsDraggingPager(false);
        setDragDx(0);
      }
      return;
    }

    const endX =
      e.changedTouches.length > 0 ? e.changedTouches[0].clientX : s.startX;
    const rawDx = endX - s.startX;
    const dt = Math.max(1, Date.now() - s.startTime);
    const velocity = Math.abs(rawDx) / dt; // px/ms
    const width = pagerRef.current?.clientWidth || window.innerWidth || 360;

    const shouldSwitch = Math.abs(rawDx) > width * 0.22 || velocity > 0.35;

    if (shouldSwitch) {
      if (rawDx < 0 && activeIndex < TABS.length - 1) {
        selectTab(TABS[activeIndex + 1].id);
      } else if (rawDx > 0 && activeIndex > 0) {
        selectTab(TABS[activeIndex - 1].id);
      }
    }

    setIsDraggingPager(false);
    setDragDx(0);
  };

  const trackTransform = isDraggingPager
    ? `translate3d(calc(${-activeIndex * 100}% + ${dragDx}px), 0, 0)`
    : `translate3d(${-activeIndex * 100}%, 0, 0)`;

  return (
    <div
      class="mh-root"
      data-active-tab={activeTab}
      onTouchStart={handleRootTouchStart}
      onTouchMove={handleRootTouchMove}
      onTouchEnd={handleRootTouchEnd}
      onTouchCancel={handleRootTouchEnd}
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

          <button
            type="button"
            class="mh-icon-btn mh-topbar-search-btn"
            aria-label="全局搜索"
            onClick={() => openObsidianSwitcher(plugin.app)}
          >
            <ObsidianIcon name="search" size={19} />
          </button>
        </header>
      )}

      <main ref={pagerRef} class="mh-content mh-pager-viewport">
        <div
          class={`mh-pager-track ${isDraggingPager ? "is-dragging" : ""}`}
          style={{ transform: trackTransform }}
        >
          <section class="mh-pager-slide">
            {mountedTabs.has(HubTab.Memo) && (
              <MemoTab
                app={plugin.app}
                settings={settings}
                hubState={plugin.hubState}
                refreshTick={refreshTick}
                onTrackDraft={(path) => {
                  plugin.pendingDraftPath = path;
                }}
              />
            )}
          </section>

          <section class="mh-pager-slide">
            {mountedTabs.has(HubTab.Diary) && (
              <DiaryTab
                app={plugin.app}
                settings={settings}
                hubState={plugin.hubState}
                refreshTick={refreshTick}
                onTrackDraft={(path) => {
                  plugin.pendingDraftPath = path;
                }}
              />
            )}
          </section>

          <section class="mh-pager-slide">
            {mountedTabs.has(HubTab.Knowledge) && (
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
          </section>
        </div>
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
