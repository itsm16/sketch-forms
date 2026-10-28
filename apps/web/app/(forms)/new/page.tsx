"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { useWiredElements } from "~/hooks/use-wired-elements";
import { FormsTable } from "~/components/Table";
import { trpc } from "~/trpc/client";

export default function Page() {
  useWiredElements();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const utils = trpc.useUtils();

  const createForm = trpc.form.CreateForm.useMutation({
    onSuccess: async (form) => {
      await utils.form.GetUserForms.invalidate();
      toast.success("Form created");
      router.push(`/form/${form.id}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleClick = () => {
    if (!title.trim()) {
      toast("Please enter a title for the form", {
        position: "top-right",
      });
      return;
    }

    createForm.mutate({
      title: title.trim(),
      tagline: tagline.trim() || null,
      canvasJson: { data: [] },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-xl bg-muted/50 p-4">
      <div className="flex flex-col">
        <label className="flex flex-col text-xl">
          Form Title
          <wired-input
            className="h-[40px] py-1 px-1 pl-2 w-[450px] max-w-full"
            value={title}
            placeholder="Enter title"
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          />
        </label>
        <label className="mt-3 flex flex-col text-xl">
          Tagline
          <wired-input
            className="h-[40px] py-1 px-1 pl-2 w-[450px] max-w-full"
            value={tagline}
            placeholder="Optional short description"
            onInput={(e) => setTagline((e.target as HTMLInputElement).value)}
          />
        </label>
        <wired-button
          onClick={handleClick}
          elevation={2}
          className="mt-5 w-fit text-md"
          disabled={createForm.isPending}
        >
          {createForm.isPending ? "Creating..." : "Create"}
        </wired-button>
      </div>
      <wired-card className="mt-4 max-h-[60%] min-h-[60%] overflow-y-auto rounded-xl p-3">
        <FormsTable />
      </wired-card>
    </div>
  );
}
