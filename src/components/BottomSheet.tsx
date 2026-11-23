import { ComponentChildren } from "preact";

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
  if (!open) return null;

  return (
    <div
      class="mh-sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div class="mh-sheet-panel" role="dialog" aria-modal="true">
        {title && <div class="mh-sheet-title">{title}</div>}
        <div class="mh-sheet-body">{children}</div>
        {showCancel && (
          <button type="button" class="mh-sheet-cancel" onClick={onClose}>
            {cancelText}
          </button>
        )}
      </div>
    </div>
  );
}
