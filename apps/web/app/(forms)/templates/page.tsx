"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { DataItem } from "~/store/canvasStore";
import { useWiredElements } from "~/hooks/use-wired-elements";
import { trpc } from "~/trpc/client";

type TemplateField = {
  label: string;
  type: "input" | "textarea";
};

type Template = {
  title: string;
  description: string;
  fields: TemplateField[];
};

const templates: Template[] = [
  {
    title: "Contact Form",
    description: "Name, email, subject & message fields",
    fields: [
      { label: "Full name", type: "input" },
      { label: "Email", type: "input" },
      { label: "Subject", type: "input" },
      { label: "Message", type: "textarea" },
    ],
  },
  {
    title: "Feedback Survey",
    description: "Rating and comments with optional email",
    fields: [
      { label: "Name", type: "input" },
      { label: "Email", type: "input" },
      { label: "What did you like?", type: "textarea" },
      { label: "What can we improve?", type: "textarea" },
    ],
  },
  {
    title: "Event Registration",
    description: "Name, email, phone & event selection",
    fields: [
      { label: "Full name", type: "input" },
      { label: "Email", type: "input" },
      { label: "Phone", type: "input" },
      { label: "Which event?", type: "input" },
    ],
  },
  {
    title: "Product Feedback",
    description: "Let customers tell you what they think",
    fields: [
      { label: "Name", type: "input" },
      { label: "Product", type: "input" },
      { label: "Your feedback", type: "textarea" },
    ],
  },
  {
    title: "Job Application",
    description: "Collect applicant details and experience",
    fields: [
      { label: "Full name", type: "input" },
      { label: "Email", type: "input" },
      { label: "Role", type: "input" },
      { label: "Why should we hire you?", type: "textarea" },
    ],
  },
  {
    title: "Booking Request",
    description: "Service, date, time & notes",
    fields: [
      { label: "Full name", type: "input" },
      { label: "Email", type: "input" },
      { label: "Preferred date", type: "input" },
      { label: "Notes", type: "textarea" },
    ],
  },
  {
    title: "Support Ticket",
    description: "Category, priority & description",
    fields: [
      { label: "Name", type: "input" },
      { label: "Email", type: "input" },
      { label: "Subject", type: "input" },
      { label: "Describe the issue", type: "textarea" },
    ],
  },
  {
    title: "Newsletter Signup",
    description: "Email, name & preferences",
    fields: [
      { label: "Name", type: "input" },
      { label: "Email", type: "input" },
      { label: "What are you interested in?", type: "textarea" },
    ],
  },
  {
    title: "Order Form",
    description: "Product, quantity & shipping details",
    fields: [
      { label: "Name", type: "input" },
      { label: "Email", type: "input" },
      { label: "Product", type: "input" },
      { label: "Shipping address", type: "textarea" },
    ],
  },
];

function buildCanvas(fields: TemplateField[]): DataItem[] {
  const startX = 60;
  const startY = 60;
  const width = 420;
  const gap = 24;

  const data: DataItem[] = [
    {
      id: 1,
      type: "form-container",
      shape: "rectangle",
      x: startX,
      y: startY,
      width,
      height: 120 + fields.length * 100,
      dashed: true,
    },
  ];

  let y = startY + 60;
  fields.forEach((field, index) => {
    data.push({
      id: index + 2,
      type: field.type === "textarea" ? "textarea-container" : "input-container",
      shape: "rectangle",
      x: startX + 30,
      y,
      width: width - 60,
      height: field.type === "textarea" ? 120 : 60,
      field_name: field.label,
    });
    y += (field.type === "textarea" ? 120 : 60) + gap;
  });

  data.push({
    id: fields.length + 100,
    type: "button",
    shape: "rectangle",
    x: startX + width / 2 - 60,
    y,
    width: 120,
    height: 50,
    field_name: "Submit",
  });

  return data;
}

export default function TemplatesPage() {
  useWiredElements();
  const router = useRouter();
  const utils = trpc.useUtils();

  const createForm = trpc.form.CreateForm.useMutation({
    onSuccess: async (form) => {
      await utils.form.GetUserForms.invalidate();
      toast.success("Form created from template");
      router.push(`/form/${form.id}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const applyTemplate = (template: Template) => {
    createForm.mutate({
      title: template.title,
      tagline: template.description,
      canvasJson: { data: buildCanvas(template.fields) },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 h-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Start with a pre-built form template.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-4">
          {templates.map((template) => (
            <wired-card
              key={template.title}
              elevation={2}
              className="transition-transform hover:scale-[1.02]"
              style={{
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                background: "#fff",
                width: "220px",
              }}
            >
              <h2 className="text-sm font-bold">{template.title}</h2>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {template.description}
              </p>

              <div
                className="rounded-lg p-2 pointer-events-none"
                style={{
                  transformOrigin: "top left",
                  width: "max-content",
                  margin: "8px auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <wired-input placeholder="Full name" disabled></wired-input>
                  <wired-input placeholder="Email" type="email" disabled></wired-input>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <wired-checkbox checked disabled></wired-checkbox>
                    <span className="text-[10px] text-muted-foreground">
                      Send me a copy
                    </span>
                  </div>
                  <wired-button
                    disabled
                    style={{ width: "100%", fontSize: "11px" }}
                  >
                    Submit
                  </wired-button>
                </div>
              </div>

              <wired-button
                elevation={1}
                style={{ width: "100%", fontSize: "12px", padding: "2px 0" }}
                onClick={() => applyTemplate(template)}
                disabled={createForm.isPending}
              >
                {createForm.isPending ? "Creating..." : "Use Template"}
              </wired-button>
            </wired-card>
          ))}
        </div>
      </div>
    </div>
  );
}
