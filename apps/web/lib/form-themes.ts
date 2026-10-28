export type FormTheme = "paper" | "minimal" | "midnight";
export type SuccessAnimation = "confetti" | "check" | "sparkle";

export const FORM_THEMES = [
  {
    id: "paper",
    name: "Paper",
    description: "Hand-drawn and playful",
    swatch: "bg-[#fafaf8] text-slate-900",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, sober shadcn",
    swatch: "bg-white text-slate-900",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark and bold",
    swatch: "bg-slate-950 text-slate-50",
  },
] as const satisfies ReadonlyArray<{
  id: FormTheme;
  name: string;
  description: string;
  swatch: string;
}>;

export const SUCCESS_ANIMATIONS = [
  {
    id: "confetti",
    name: "Confetti",
    description: "Celebratory burst",
  },
  {
    id: "check",
    name: "Check",
    description: "Animated tick",
  },
  {
    id: "sparkle",
    name: "Sparkle",
    description: "Twinkling stars",
  },
] as const satisfies ReadonlyArray<{
  id: SuccessAnimation;
  name: string;
  description: string;
}>;

export function isFormTheme(value: unknown): value is FormTheme {
  return FORM_THEMES.some((theme) => theme.id === value);
}

export function isSuccessAnimation(value: unknown): value is SuccessAnimation {
  return SUCCESS_ANIMATIONS.some((animation) => animation.id === value);
}
