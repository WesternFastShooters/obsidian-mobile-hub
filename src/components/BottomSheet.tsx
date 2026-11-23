import { ComponentChildren } from "preact";
import { createPortal } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  showCancel?: boolean;
  cancelText?: string;
  children: ComponentChildren;
}

export function BottomSheet({
  open,
  onClose,
  title,
  showCancel = false,
  cancelText = "取消",
  children,
}: BottomSheetProps) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  const dragStartY = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      setDragOffsetY(0);
    } else if (rendered) {
      setClosing(true);
      const timer = window.setTimeout(() => {
        setRendered(false);
        setClosing(false);
        setDragOffsetY(0);
      }, 190);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  if (!rendered) return null;

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const panel = panelRef.current;
    if (panel && panel.scrollTop > 0) return;
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (dragStartY.current === null || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) {
      setDragOffsetY(dy);
    }
  };

  const handleTouchEnd = () => {
    if (dragStartY.current === null) return;
    dragStartY.current = null;
    if (dragOffsetY > 75) {
      setDragOffsetY(0);
      onClose();
    } else {
      setDragOffsetY(0);
    }
  };

  return createPortal(
    <div
      class={`mh-sheet-backdrop ${closing ? "is-closing" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        class={`mh-sheet-panel ${closing ? "is-closing" : ""}`}
        style={
          dragOffsetY > 0
            ? { transform: `translateY(${dragOffsetY}px)`, transition: "none" }
            : undefined
        }
        role="dialog"
        aria-modal="true"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {title && <div class="mh-sheet-title">{title}</div>}
        <div class="mh-sheet-body">{children}</div>
        {showCancel && (
          <button type="button" class="mh-sheet-cancel" onClick={onClose}>
            {cancelText}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
