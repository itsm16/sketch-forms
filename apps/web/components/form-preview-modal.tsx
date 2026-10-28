"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useWiredElements } from "~/hooks/use-wired-elements";
import {
  SUCCESS_ANIMATIONS,
  type FormTheme,
  type SuccessAnimation,
} from "~/lib/form-themes";
import type { DataItem } from "~/store/canvasStore";

function labelFromFieldName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FormPreviewModal({
  open,
  onOpenChange,
  formName,
  tagline,
  items = [],
  theme = "paper",
  successAnimation = "confetti",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formName?: string;
  tagline?: string;
  items?: DataItem[];
  theme?: FormTheme;
  successAnimation?: SuccessAnimation;
}) {
  useWiredElements();

  const isPaper = theme === "paper";
  const isMidnight = theme === "midnight";
  const isClean = !isPaper;

  const surfaceClass = isPaper
    ? "bg-[#fafaf8] text-slate-900"
    : isMidnight
      ? "bg-slate-950 text-slate-50 font-sans"
      : "bg-slate-50 text-slate-900 font-sans";

  const cardClass = isPaper
    ? "bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    : isMidnight
      ? "bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
      : "bg-white border border-slate-200 rounded-2xl shadow-sm";

  const labelClass = isPaper
    ? "text-sm font-bold uppercase tracking-wide text-black/50"
    : isMidnight
      ? "text-sm font-medium text-slate-300"
      : "text-sm font-medium text-slate-700";

  const textClass = isPaper
    ? "text-center text-xl font-bold text-black"
    : isMidnight
      ? "text-center text-xl font-semibold text-slate-100"
      : "text-center text-xl font-semibold text-slate-900";

  const lineClass = isPaper
    ? "border-black/20"
    : isMidnight
      ? "border-slate-700"
      : "border-slate-200";

  const cleanInputClass = isMidnight
    ? "border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
    : "";

  const successName =
    SUCCESS_ANIMATIONS.find((animation) => animation.id === successAnimation)
      ?.name ?? "Confetti";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[820px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{formName || "Form Preview"}</DialogTitle>
        </DialogHeader>

        <div className={`rounded-xl p-5 md:p-8 ${surfaceClass}`}>
          <div className={`p-6 md:p-10 ${cardClass}`}>
            <div className="text-center mb-8">
              {isPaper && (
                <div className="text-4xl mb-3 inline-block rotate-[-4deg] select-none">
                  📝
                </div>
              )}
              {isClean && (
                <p
                  className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${
                    isMidnight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Form
                </p>
              )}
              <h2
                className={`text-3xl font-bold ${
                  isPaper ? "text-black" : isMidnight ? "text-white" : "text-slate-900"
                }`}
              >
                {formName || "Untitled Form"}
              </h2>
              {tagline && (
                <p
                  className={`mt-2 text-sm ${
                    isPaper
                      ? "text-black/50"
                      : isMidnight
                        ? "text-slate-400"
                        : "text-slate-500"
                  }`}
                >
                  {tagline}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {items.map((item) => {
                const label = labelFromFieldName(item.field_name ?? "");

                if (item.shape === "text") {
                  return (
                    <p key={item.id} className={textClass}>
                      {item.text}
                    </p>
                  );
                }

                if (item.shape === "line") {
                  return <hr key={item.id} className={lineClass} />;
                }

                if (item.type === "input-container") {
                  return (
                    <label key={item.id} className="flex flex-col gap-1.5">
                      <span className={labelClass}>{label}</span>
                      {isPaper ? (
                        <wired-input
                          placeholder={label}
                          className="w-full"
                        ></wired-input>
                      ) : (
                        <Input
                          disabled
                          placeholder={label}
                          className={cleanInputClass}
                        />
                      )}
                    </label>
                  );
                }

                if (item.type === "textarea-container") {
                  return (
                    <label key={item.id} className="flex flex-col gap-1.5">
                      <span className={labelClass}>{label}</span>
                      {isPaper ? (
                        <wired-textarea
                          placeholder={label}
                          rows={5}
                          className="w-full"
                        ></wired-textarea>
                      ) : (
                        <Textarea
                          disabled
                          placeholder={label}
                          rows={5}
                          className={cleanInputClass}
                        />
                      )}
                    </label>
                  );
                }

                if (item.type === "button") {
                  return (
                    <div key={item.id} className="flex justify-end pt-2">
                      {isPaper ? (
                        <wired-button className="primary" elevation={2}>
                          {label || "Submit"}
                        </wired-button>
                      ) : (
                        <Button
                          disabled
                          className={
                            isMidnight
                              ? "bg-white text-slate-950 hover:bg-slate-200"
                              : ""
                          }
                        >
                          {label || "Submit"}
                        </Button>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>

            <p
              className={`mt-8 text-center text-xs ${
                isPaper
                  ? "text-black/35"
                  : isMidnight
                    ? "text-slate-500"
                    : "text-slate-400"
              }`}
            >
              After submit: {successName} animation
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
