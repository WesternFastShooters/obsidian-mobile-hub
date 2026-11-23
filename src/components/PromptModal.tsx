import { useEffect, useRef, useState } from "preact/hooks";
import { createPortal } from "preact/compat";

interface PromptModalProps {
  open: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  danger?: boolean;
  confirmOnly?: boolean;
  message?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}

export function PromptModal({
  open,
  title,
  placeholder = "",
  initialValue = "",
  confirmText = "确定",
  danger = false,
  confirmOnly = false,
  message,
  onCancel,
  onConfirm,
}: PromptModalProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 30);
    }
  }, [open, initialValue]);

  if (!open) return null;

  const submit = () => {
    if (!confirmOnly && !value.trim()) return;
    onConfirm(value.trim());
  };

  return createPortal(
    <div
      class="mh-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div class="mh-modal-card" role="dialog" aria-modal="true">
        <div class="mh-modal-title">{title}</div>
        {message && <div class="mh-modal-message">{message}</div>}
        {!confirmOnly && (
          <input
            ref={inputRef}
            type="text"
            class="mh-modal-input"
            placeholder={placeholder}
            value={value}
            onInput={(e) => setValue((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") onCancel();
            }}
          />
        )}
        <div class="mh-modal-actions">
          <button type="button" class="mh-btn mh-btn-ghost" onClick={onCancel}>
            取消
          </button>
          <button
            type="button"
            class={`mh-btn ${danger ? "mh-btn-danger" : "mh-btn-primary"}`}
            onClick={submit}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
