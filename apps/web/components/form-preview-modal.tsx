"use client";

import "wired-elements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
  items = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formName?: string;
  items?: DataItem[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{formName || "Form Preview"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {items.map((item) => {
            const label = labelFromFieldName(item.field_name ?? "");

            if (item.type === "input-container") {
              return (
                <label
                  key={item.id}
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <wired-input
                    placeholder={label}
                    className="w-full"
                  ></wired-input>
                </label>
              );
            }

            if (item.type === "textarea-container") {
              return (
                <label
                  key={item.id}
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <wired-textarea
                    placeholder={label}
                    rows={5}
                    className="w-full"
                  ></wired-textarea>
                </label>
              );
            }

            if (item.type === "button") {
              return (
                <div key={item.id} className="flex justify-end pt-2">
                  <wired-button className="primary" elevation={2}>
                    {label || "Submit"}
                  </wired-button>
                </div>
              );
            }

            return null;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
