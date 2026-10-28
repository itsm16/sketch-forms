"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import Canvas from "~/components/canvas/canvas";
import FormPreviewModal from "~/components/form-preview-modal";
import { SketchToggle } from "~/components/sketch-toggle";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  FORM_THEMES,
  SUCCESS_ANIMATIONS,
  isFormTheme,
  isSuccessAnimation,
  type FormTheme,
  type SuccessAnimation,
} from "~/lib/form-themes";
import {
  getCanvasData,
  getInsideFormContainer,
  useCanvasStore,
  type DataItem,
} from "~/store/canvasStore";
import { useLiveUrl } from "~/hooks/use-live-url";
import { useWiredElements } from "~/hooks/use-wired-elements";
import { trpc } from "~/trpc/client";

function Builder({ formId }: { formId: string }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [initialData, setInitialData] = useState<DataItem[] | null>(null);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [theme, setTheme] = useState<FormTheme>("paper");
  const [successAnimation, setSuccessAnimation] =
    useState<SuccessAnimation>("confetti");

  const utils = trpc.useUtils();

  const formQuery = trpc.form.GetFormById.useQuery(
    { formId },
    { staleTime: 0, gcTime: 0, refetchOnMount: "always" },
  );

  const updateForm = trpc.form.UpdateForm.useMutation({
    onSuccess: async (form, variables) => {
      utils.form.GetFormById.setData({ formId }, form);
      await Promise.all([
        utils.form.GetUserForms.invalidate(),
        utils.form.GetFormResponses.invalidate({ formId }),
      ]);
      toast.success(variables.canvasJson ? "Form saved" : "Form updated");
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!formQuery.data || initialData !== null) return;

    setInitialData(getCanvasData(formQuery.data.canvasJson));
    setTitle(formQuery.data.title);
    setTagline(formQuery.data.tagline ?? "");
    setIsLive(formQuery.data.isLive);
    setTheme(isFormTheme(formQuery.data.theme) ? formQuery.data.theme : "paper");
    setSuccessAnimation(
      isSuccessAnimation(formQuery.data.successAnimation)
        ? formQuery.data.successAnimation
        : "confetti",
    );
  }, [formQuery.data, initialData]);

  const liveUrl = useLiveUrl(formId);

  const allData = useCanvasStore((state) => state.data);
  const previewItems = getInsideFormContainer(allData);

  const handleSave = (data: DataItem[]) => {
    updateForm.mutate({
      formId,
      title: title.trim() || "Untitled form",
      tagline: tagline.trim() || null,
      canvasJson: { data },
      isLive,
      theme,
      successAnimation,
    });
  };

  const handleLiveChange = (checked: boolean) => {
    setIsLive(checked);
    updateForm.mutate({ formId, isLive: checked });
  };

  const handleThemeChange = (nextTheme: FormTheme) => {
    setTheme(nextTheme);
    updateForm.mutate({ formId, theme: nextTheme });
  };

  const handleSuccessAnimationChange = (nextAnimation: SuccessAnimation) => {
    setSuccessAnimation(nextAnimation);
    updateForm.mutate({ formId, successAnimation: nextAnimation });
  };

  if (formQuery.isLoading || initialData === null) {
    return (
      <p className="p-6 text-muted-foreground">
        {formQuery.isError ? formQuery.error.message : "Loading form..."}
      </p>
    );
  }

  return (
    <>
      <div className="grid h-full grid-rows-1 gap-4 md:grid-cols-3">
        <div className="col-span-2 rounded-xl bg-muted/50">
          <Canvas initialData={initialData} onSave={handleSave} />
        </div>

        <div className="grid grid-rows-[auto_1fr] w-full gap-4">
          <div className="flex flex-col gap-4 rounded-xl bg-muted/50 p-4">
            <div className="grid gap-2">
              <Label htmlFor="form-title">Title</Label>
              <Input
                id="form-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={40}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="form-tagline">Tagline</Label>
              <Input
                id="form-tagline"
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                maxLength={100}
              />
            </div>

            <div className="grid gap-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                {FORM_THEMES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleThemeChange(option.id)}
                    className={`rounded-lg border p-2 text-left transition ${
                      theme === option.id
                        ? "border-foreground ring-1 ring-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <span
                      className={`mb-1.5 block h-7 w-full rounded-md border border-black/10 ${option.swatch}`}
                    >
                      <span className="mt-2 ml-2 block h-1.5 w-8 rounded bg-current opacity-40" />
                    </span>
                    <span className="block text-xs font-medium">
                      {option.name}
                    </span>
                    <span className="block text-[10px] leading-tight text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>After submit</Label>
              <div className="grid grid-cols-3 gap-2">
                {SUCCESS_ANIMATIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSuccessAnimationChange(option.id)}
                    className={`rounded-lg border px-2 py-1.5 text-left transition ${
                      successAnimation === option.id
                        ? "border-foreground ring-1 ring-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <span className="block text-xs font-medium">
                      {option.name}
                    </span>
                    <span className="block text-[10px] leading-tight text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Accepting responses</p>
                <p className="text-xs text-muted-foreground">
                  Turn this off to take the form offline.
                </p>
              </div>
              <SketchToggle
                checked={isLive}
                onCheckedChange={handleLiveChange}
                label="Toggle accepting responses"
              />
            </div>

            {formId && (
              <div className="text-sm">
                <span className="font-semibold text-[#4F72FC]">Live at:</span>{" "}
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all underline hover:text-foreground"
                >
                  {liveUrl}
                </a>
              </div>
            )}

            <wired-button
              elevation={2}
              className="w-fit"
              disabled={updateForm.isPending}
              onClick={() => handleSave(useCanvasStore.getState().data)}
            >
              {updateForm.isPending ? "Saving..." : "Save changes"}
            </wired-button>
          </div>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="group relative flex flex-col items-center justify-center rounded-xl bg-muted/50 p-4 transition-all hover:bg-muted/70 cursor-pointer overflow-hidden hover:scale-[1.015]"
          >
            <span className="relative z-20 text-2xl font-semibold">
              Click to preview
            </span>
            <div className="relative z-20 flex size-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 text-muted-foreground group-hover:border-muted-foreground/70 mt-1 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="relative z-10 w-full h-full flex items-center justify-center rounded-lg blur-[3px]">
              <div className="relative scale-[1.15] origin-center">
                <wired-card
                  elevation={1}
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "40px",
                    width: "90%",
                  }}
                >
                  <div style={{ display: "flex", gap: "30px" }}>
                    <wired-input
                      placeholder="Full name"
                      disabled
                      style={{ flex: 1 }}
                    ></wired-input>
                    <wired-input
                      placeholder="Email"
                      disabled
                      style={{ flex: 1 }}
                    ></wired-input>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      margin: "10px 0px",
                    }}
                  >
                    <wired-checkbox checked disabled></wired-checkbox>
                    <span style={{ fontSize: "13px", color: "#333" }}>
                      Subscribe to newsletter
                    </span>
                  </div>
                  <wired-button disabled style={{ width: "100%" }}>
                    Submit
                  </wired-button>
                </wired-card>
              </div>
            </div>
            <span className="relative z-20 mt-1 text-lg font-medium text-foreground">
              {title || "Untitled Form"}
            </span>
          </button>
        </div>
      </div>
      <FormPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        formName={title}
        tagline={tagline}
        items={previewItems}
        theme={theme}
        successAnimation={successAnimation}
      />
    </>
  );
}

export default function Page() {
  useWiredElements();

  const params = useParams<{ formId: string }>();
  const formId = Array.isArray(params.formId) ? params.formId[0] : params.formId;

  if (!formId) {
    return <p className="p-6 text-muted-foreground">Invalid form id.</p>;
  }

  return <Builder key={formId} formId={formId} />;
}
