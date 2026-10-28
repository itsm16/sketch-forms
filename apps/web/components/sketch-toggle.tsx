"use client";

import { useEffect, useRef } from "react";

import { useWiredElements } from "~/hooks/use-wired-elements";

export function SketchToggle({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  useWiredElements();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    (element as HTMLElement & { checked: boolean }).checked = checked;
  }, [checked]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ checked?: boolean }>).detail;
      onCheckedChange(Boolean(detail?.checked));
    };

    element.addEventListener("change", handleChange);
    return () => element.removeEventListener("change", handleChange);
  }, [onCheckedChange]);

  return (
    <wired-toggle
      ref={ref}
      checked={checked}
      disabled={disabled}
      aria-label={label}
      className={className}
    />
  );
}
