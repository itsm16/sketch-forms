"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { RoughNotation } from "react-rough-notation";

import { FormSuccess } from "~/components/form-success";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useWiredElements } from "~/hooks/use-wired-elements";
import {
  isFormTheme,
  isSuccessAnimation,
  type FormTheme,
} from "~/lib/form-themes";

import {
  getCanvasData,
  getInsideFormContainer,
  type DataItem,
} from "~/store/canvasStore";
import { trpc } from "~/trpc/client";

function fieldKey(item: DataItem) {
  return item.field_name?.trim() || `field-${item.id}`;
}

function fieldLabel(item: DataItem) {
  const name = item.field_name?.trim();
  if (!name) return "Untitled field";
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function LiveForm() {
  useWiredElements();
  const params = useParams<{ id: string }>();
  const formId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const formQuery = trpc.form.GetFormById.useQuery(
    { formId: formId ?? "" },
    {
      enabled: Boolean(formId),
      staleTime: 0,
      refetchOnMount: "always",
    },
  );

  const submitResponse = trpc.form.SubmitResponse.useMutation({
    onSuccess: async () => {
      setSubmitted(true);

      if (formId) {
        await Promise.all([
          utils.form.GetFormResponses.invalidate({ formId }),
          utils.form.GetUserForms.invalidate(),
        ]);
      }
    },
  });

  const fields = useMemo(() => {
    if (!formQuery.data) return [];

    return getInsideFormContainer(
      getCanvasData(formQuery.data.canvasJson),
    ).sort((a, b) => a.y - b.y);
  }, [formQuery.data]);

  const handleFieldChange = (
    key: string,
    event: React.FormEvent<HTMLElement>,
  ) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    setAnswers((previous) => ({ ...previous, [key]: target.value }));
    setFormError(null);
  };

  const handleSubmit = () => {
    if (!formId || submitResponse.isPending) return;

    const requiredFields = fields.filter((field) =>
      ["input-container", "textarea-container"].includes(field.type ?? ""),
    );

    if (requiredFields.some((field) => !answers[fieldKey(field)]?.trim())) {
      setFormError("Please fill in every field before submitting.");
      return;
    }

    setFormError(null);
    submitResponse.mutate({ formId, answers });
  };

  if (formQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-black/50">
        Loading form...
      </div>
    );
  }

  if (formQuery.isError || !formQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-black/50">
        {formQuery.error?.message ?? "Form not found"}
      </div>
    );
  }

  const form = formQuery.data;
  const theme: FormTheme = isFormTheme(form.theme) ? form.theme : "paper";
  const successAnimation = isSuccessAnimation(form.successAnimation)
    ? form.successAnimation
    : "confetti";
  const hasSubmitButton = fields.some((field) => field.type === "button");

  const isPaper = theme === "paper";
  const isMidnight = theme === "midnight";

  if (!form.isLive) {
    const closedSurface = isPaper
      ? "bg-[#fafaf8] text-black"
      : isMidnight
        ? "bg-slate-950 font-sans text-white"
        : "bg-slate-50 font-sans text-slate-900";

    return (
      <div
        className={`flex min-h-screen items-center justify-center px-6 text-center ${closedSurface}`}
      >
        <div>
          <h1 className="text-4xl font-black">This form is closed</h1>
          <p
            className={`mt-2 ${
              isMidnight ? "text-slate-400" : "text-black/50"
            }`}
          >
            The owner is no longer accepting responses.
          </p>
        </div>
      </div>
    );
  }

  const surfaceClass = isPaper
    ? "live-paper min-h-screen flex flex-col items-center px-4 pt-10"
    : isMidnight
      ? "min-h-screen flex flex-col items-center bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-12 font-sans text-slate-50"
      : "min-h-screen flex flex-col items-center bg-slate-50 px-4 py-12 font-sans text-slate-900";

  const cardClass = isPaper
    ? "paper-card relative w-full p-8 md:p-12"
    : isMidnight
      ? "w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl md:p-12"
      : "w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12";

  const titleClass = isPaper
    ? "text-4xl md:text-5xl font-black text-black mb-2"
    : isMidnight
      ? "text-3xl font-semibold tracking-tight text-white md:text-4xl"
      : "text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl";

  const taglineClass = isPaper
    ? "text-black/50 text-sm md:text-base"
    : isMidnight
      ? "mt-2 text-sm text-slate-400 md:text-base"
      : "mt-2 text-sm text-slate-500 md:text-base";

  const fieldLabelClass = isPaper
    ? "form-label"
    : isMidnight
      ? "mb-2 block text-sm font-medium text-slate-300"
      : "mb-2 block text-sm font-medium text-slate-700";

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

  const inputClass = isMidnight
    ? "h-11 border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
    : "h-11";

  const textareaClass = isMidnight
    ? "min-h-28 border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
    : "min-h-28";

  const errorClass = isMidnight ? "text-red-400" : "text-red-600";

  const footerClass = isPaper
    ? "text-black/30"
    : isMidnight
      ? "text-slate-500"
      : "text-slate-400";

  const renderSubmitButton = (label: string) => {
    if (isPaper) {
      return (
        <wired-button
          className="primary"
          elevation={2}
          onClick={handleSubmit}
          disabled={submitResponse.isPending}
        >
          {submitResponse.isPending ? "Sending..." : label}
        </wired-button>
      );
    }

    return (
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={submitResponse.isPending}
        className={
          isMidnight
            ? "bg-white px-6 text-slate-950 hover:bg-slate-200"
            : "px-6"
        }
      >
        {submitResponse.isPending ? "Sending..." : label}
      </Button>
    );
  };

  const fieldsContent = (
    <div className="space-y-8">
      {fields.map((field) => {
        const key = fieldKey(field);
        const label = fieldLabel(field);

        if (field.shape === "text") {
          return (
            <p key={field.id} className={textClass}>
              {field.text}
            </p>
          );
        }

        if (field.shape === "line") {
          return <hr key={field.id} className={lineClass} />;
        }

        if (field.type === "button") {
          return (
            <div
              key={field.id}
              className={`flex flex-col gap-2 pt-4 ${
                isPaper ? "items-center" : "items-stretch"
              }`}
            >
              {renderSubmitButton(field.field_name?.trim() || "Submit")}
              {(formError || submitResponse.error) && (
                <p className={`text-sm ${errorClass}`}>
                  {formError ?? submitResponse.error?.message}
                </p>
              )}
            </div>
          );
        }

        return (
          <div key={field.id}>
            <label className={fieldLabelClass}>{label}</label>
            {field.type === "textarea-container" ? (
              isPaper ? (
                <wired-textarea
                  placeholder={label}
                  rows={5}
                  onChange={(event) => handleFieldChange(key, event)}
                ></wired-textarea>
              ) : (
                <Textarea
                  placeholder={label}
                  rows={5}
                  className={textareaClass}
                  value={answers[key] ?? ""}
                  onChange={(event) => handleFieldChange(key, event)}
                />
              )
            ) : isPaper ? (
              <wired-input
                placeholder={label}
                value={answers[key] ?? ""}
                onChange={(event) => handleFieldChange(key, event)}
              ></wired-input>
            ) : (
              <Input
                placeholder={label}
                className={inputClass}
                value={answers[key] ?? ""}
                onChange={(event) => handleFieldChange(key, event)}
              />
            )}
          </div>
        );
      })}

      {!hasSubmitButton && (
        <div
          className={`flex flex-col gap-2 pt-4 ${
            isPaper ? "items-center" : "items-stretch"
          }`}
        >
          {renderSubmitButton("Submit")}
          {(formError || submitResponse.error) && (
            <p className={`text-sm ${errorClass}`}>
              {formError ?? submitResponse.error?.message}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        :root {
          --paper-bg: #fafaf8;
          --paper-line: rgba(0,0,0,0.06);
          --paper-spacing: 28px;
          --paper-margin: rgba(0,0,0,0.14);
          --paper-dot: rgba(0,0,0,0.02);
        }

        .live-paper {
          background-color: var(--paper-bg);
          background-image:
            radial-gradient(circle at 10% 10%, var(--paper-dot) 0.5px, transparent 0.6px),
            repeating-linear-gradient(
              to bottom,
              var(--paper-line) 0px,
              var(--paper-line) 1px,
              transparent 1px,
              transparent var(--paper-spacing)
            ),
            linear-gradient(to right, transparent 48px, var(--paper-margin) 49px, transparent 50px);
          background-size: 60px 60px, 100% var(--paper-spacing), 100% 100%;
        }

        .live-paper wired-input,
        .live-paper wired-textarea {
          --wired-elements-fill: rgba(255,255,255,0.92);
          --wired-elements-color: #000000;
          width: 100%;
          border-radius: 6px;
          padding: 8px;
        }

        .live-paper wired-button {
          --wired-elements-fill: #000000;
          --wired-elements-color: #ffffff;
          font-weight: 700;
          border-radius: 6px;
        }

        .paper-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06),
            inset 0 0 0 1px rgba(0,0,0,0.04);
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0.025) 0px,
            rgba(0,0,0,0.025) 1px,
            transparent 1px,
            transparent 26px
          );
          background-size: 100% 26px;
        }

        .masking-tape {
          position: absolute;
          width: 80px;
          height: 20px;
          background: rgba(200,200,200,0.4);
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          border-radius: 4px;
          backdrop-filter: blur(2px);
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.5);
          margin-bottom: 6px;
        }
      `}</style>

      <div className={surfaceClass}>
        <div className="mx-auto w-full max-w-2xl">
          <div className={cardClass}>
            {isPaper && <div className="masking-tape !bg-black/5"></div>}

            <div className={`text-center ${isPaper ? "mb-10" : "mb-8"}`}>
              {isPaper ? (
                <div className="mb-4 inline-block rotate-[-4deg] select-none text-5xl">
                  📝
                </div>
              ) : (
                <p
                  className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${
                    isMidnight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Form
                </p>
              )}
              <h1 className={titleClass}>{form.title}</h1>
              {form.tagline && <p className={taglineClass}>{form.tagline}</p>}
            </div>

            {submitted ? (
              <FormSuccess
                animation={successAnimation}
                theme={theme}
              />
            ) : fields.length === 0 ? (
              <p
                className={`py-12 text-center ${
                  isMidnight ? "text-slate-400" : "text-black/50"
                }`}
              >
                This form does not have any fields yet.
              </p>
            ) : isPaper ? (
              <RoughNotation
                type="box"
                show={true}
                animate={false}
                strokeWidth={1}
                padding={[10, 20]}
              >
                {fieldsContent}
              </RoughNotation>
            ) : (
              fieldsContent
            )}
          </div>

          <p className={`mt-8 text-center text-xs ${footerClass}`}>
            Sketch Forms &mdash; hand-crafted with care
          </p>
        </div>
      </div>
    </>
  );
}
