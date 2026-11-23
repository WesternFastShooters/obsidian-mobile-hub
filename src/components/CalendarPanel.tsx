import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { ObsidianIcon } from "./ObsidianIcon";
import { formatDateKey } from "../utils/obsidian";

interface CalendarPanelProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateKey: string) => void;
  markedDates: Set<string>;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  weekStartsMonday?: boolean;
}

interface DayCell {
  dateKey: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function CalendarPanel({
  selectedDate,
  onSelectDate,
  markedDates,
  collapsible = false,
  initialCollapsed = false,
  onCollapsedChange,
  weekStartsMonday = true,
}: CalendarPanelProps) {
  const initialDate = useMemo(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return { year: y || new Date().getFullYear(), month: (m || 1) - 1 };
  }, []);

  const [viewYear, setViewYear] = useState(initialDate.year);
  const [viewMonth, setViewMonth] = useState(initialDate.month);
  const [collapsed, setCollapsedState] = useState(initialCollapsed);
  const [transitionKey, setTransitionKey] = useState(0);

  // Center Year/Month Picker Modal
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<"month" | "year">("month");

  const handlerDragStartY = useRef<number | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const activeYearBtnRef = useRef<HTMLButtonElement>(null);
  const todayKey = formatDateKey(new Date());

  const setCollapsed = (next: boolean | ((prev: boolean) => boolean)) => {
    setCollapsedState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      onCollapsedChange?.(resolved);
      return resolved;
    });
  };

  // Auto-scroll active year into center when switching to Year tab (P2 #13)
  useEffect(() => {
    if (pickerOpen && pickerTab === "year") {
      requestAnimationFrame(() => {
        activeYearBtnRef.current?.scrollIntoView({ block: "center" });
      });
    }
  }, [pickerOpen, pickerTab]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const list: number[] = [];
    for (let y = currentYear + 5; y >= currentYear - 30; y--) {
      list.push(y);
    }
    return list;
  }, []);

  const weekHeaders = weekStartsMonday
    ? ["一", "二", "三", "四", "五", "六", "日"]
    : ["日", "一", "二", "三", "四", "五", "六"];

  const weeks: DayCell[][] = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    let offset = firstDay.getDay();
    if (weekStartsMonday) {
      offset = (offset + 6) % 7;
    }
    const startDate = new Date(viewYear, viewMonth, 1 - offset);
    const rows: DayCell[][] = [];
    for (let w = 0; w < 6; w++) {
      const row: DayCell[] = [];
      for (let d = 0; d < 7; d++) {
        const cur = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + w * 7 + d
        );
        const key = formatDateKey(cur);
        row.push({
          dateKey: key,
          day: cur.getDate(),
          inCurrentMonth: cur.getMonth() === viewMonth,
          isToday: key === todayKey,
        });
      }
      rows.push(row);
    }
    if (rows.length === 6 && rows[5].every((c) => !c.inCurrentMonth)) {
      rows.pop();
    }
    return rows;
  }, [viewYear, viewMonth, weekStartsMonday, todayKey]);

  const activeWeekIndex = useMemo(() => {
    const idx = weeks.findIndex((row) => row.some((c) => c.dateKey === selectedDate));
    return idx >= 0 ? idx : 0;
  }, [weeks, selectedDate]);

  const visibleWeeks = collapsed ? [weeks[activeWeekIndex]] : weeks;

  const shiftPeriod = (delta: number) => {
    setTransitionKey((k) => k + 1);
    if (collapsed) {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const next = new Date(y, m - 1, d + delta * 7);
      setViewYear(next.getFullYear());
      setViewMonth(next.getMonth());
      onSelectDate(formatDateKey(next));
      return;
    }
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const goToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onSelectDate(formatDateKey(now));
    setTransitionKey((k) => k + 1);
    setPickerOpen(false);
  };

  const handleSwipeStart = (clientX: number, clientY: number) => {
    swipeStart.current = { x: clientX, y: clientY };
  };

  const handleSwipeEnd = (clientX: number, clientY: number) => {
    if (!swipeStart.current) return;
    const dx = clientX - swipeStart.current.x;
    const dy = clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      shiftPeriod(dx < 0 ? 1 : -1);
    }
  };

  const handleHandlerPointerDown = (e: PointerEvent) => {
    if (!collapsible) return;
    e.stopPropagation();
    handlerDragStartY.current = e.clientY;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore synthetic events
    }
  };

  const handleHandlerPointerUp = (e: PointerEvent) => {
    if (!collapsible || handlerDragStartY.current === null) return;
    e.stopPropagation();
    const dy = e.clientY - handlerDragStartY.current;
    handlerDragStartY.current = null;
    if (dy < -20) {
      setCollapsed(true);
    } else if (dy > 20) {
      setCollapsed(false);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const openPicker = () => {
    setPickerTab("month");
    setPickerOpen(true);
  };

  return (
    <div
      class={`mh-calendar ${collapsed ? "is-collapsed" : ""}`}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          handleSwipeStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={(e) => {
        if (e.changedTouches.length === 1) {
          handleSwipeEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") {
          handleSwipeStart(e.clientX, e.clientY);
        }
      }}
      onPointerUp={(e) => {
        if (e.pointerType === "mouse") {
          handleSwipeEnd(e.clientX, e.clientY);
        }
      }}
    >
      <div class="mh-cal-header">
        <button
          type="button"
          class="mh-cal-month-trigger"
          onClick={openPicker}
        >
          <span>
            {viewYear}年{viewMonth + 1}月
          </span>
        </button>
      </div>

      <div class="mh-cal-weekdays">
        {weekHeaders.map((w) => (
          <div key={w} class="mh-cal-weekday">
            {w}
          </div>
        ))}
      </div>

      <div key={transitionKey} class="mh-cal-grid mh-cal-grid-animate">
        {visibleWeeks.map((row, rIdx) => (
          <div key={rIdx} class="mh-cal-row">
            {row.map((cell) => {
              const isSelected = cell.dateKey === selectedDate;
              const hasMark = markedDates.has(cell.dateKey);
              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  class={[
                    "mh-cal-cell",
                    !cell.inCurrentMonth && !collapsed ? "is-outside" : "",
                    cell.isToday ? "is-today" : "",
                    isSelected ? "is-selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    onSelectDate(cell.dateKey);
                    if (!cell.inCurrentMonth) {
                      const [y, m] = cell.dateKey.split("-").map(Number);
                      setViewYear(y);
                      setViewMonth(m - 1);
                    }
                  }}
                >
                  <span class="mh-cal-day-num">{cell.day}</span>
                  <span class={`mh-cal-dot ${hasMark ? "is-visible" : ""}`} />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {collapsible && (
        <div
          class="mh-cal-handler-area"
          role="button"
          aria-label={collapsed ? "展开月历" : "收起为周历"}
          onPointerDown={handleHandlerPointerDown}
          onPointerUp={handleHandlerPointerUp}
        >
          <div class="mh-cal-handler-bar" />
        </div>
      )}

      {pickerOpen && (
        <div
          class="mh-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPickerOpen(false);
          }}
        >
          <div class="mh-ym-modal" role="dialog" aria-modal="true">
            <div class="mh-ym-header">
              <div class="mh-ym-tabs">
                <button
                  type="button"
                  class={`mh-ym-tab ${pickerTab === "month" ? "is-active" : ""}`}
                  onClick={() => setPickerTab("month")}
                >
                  {viewMonth + 1}月
                </button>
                <button
                  type="button"
                  class={`mh-ym-tab ${pickerTab === "year" ? "is-active" : ""}`}
                  onClick={() => setPickerTab("year")}
                >
                  {viewYear}
                </button>
              </div>
              <button
                type="button"
                class="mh-icon-btn mh-ym-reset-btn"
                aria-label="回到今天"
                title="回到今天"
                onClick={goToday}
              >
                <ObsidianIcon name="rotate-ccw" size={20} />
              </button>
            </div>

            {pickerTab === "month" ? (
              <div class="mh-ym-month-grid">
                {MONTHS.map((m) => {
                  const active = m - 1 === viewMonth;
                  return (
                    <button
                      key={m}
                      type="button"
                      class={`mh-ym-month-cell ${active ? "is-active" : ""}`}
                      onClick={() => {
                        setViewMonth(m - 1);
                        setTransitionKey((k) => k + 1);
                        setPickerOpen(false);
                      }}
                    >
                      {m}月
                    </button>
                  );
                })}
              </div>
            ) : (
              <div class="mh-ym-year-list">
                {yearOptions.map((y) => {
                  const active = y === viewYear;
                  return (
                    <button
                      key={y}
                      ref={active ? activeYearBtnRef : undefined}
                      type="button"
                      class={`mh-ym-year-item ${active ? "is-active" : ""}`}
                      onClick={() => {
                        setViewYear(y);
                        setPickerTab("month");
                      }}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
