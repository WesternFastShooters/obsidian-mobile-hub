import { useEffect, useRef } from "preact/hooks";
import { setIcon } from "obsidian";

interface ObsidianIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function ObsidianIcon({ name, size = 18, className = "" }: ObsidianIconProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.empty?.();
    ref.current.innerHTML = "";
    setIcon(ref.current, name);
    const svg = ref.current.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
    }
  }, [name, size]);

  return (
    <span
      ref={ref}
      class={`mh-icon ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    />
  );
}
