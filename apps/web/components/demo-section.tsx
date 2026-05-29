"use client";

import Canvas from "~/components/canvas/canvas";
import WrapperDiv from "~/components/canvas/wrapper-div";
import { useCanvasStore, getInsideFormContainer, type DataItem } from "~/store/canvasStore";
import "wired-elements";

function labelFromFieldName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const initialData: DataItem[] = [
  {
    id: 1,
    type: "form-container",
    shape: "rectangle",
    x: 220,
    y: 30,
    width: 420,
    height: 520,
    dashed: true,
  },
  {
    id: 2,
    type: "input-container",
    shape: "rectangle",
    x: 240,
    y: 100,
    width: 220,
    height: 60,
    field_name: "name",
  },
  {
    id: 3,
    type: "input-container",
    shape: "rectangle",
    x: 690,
    y: 100,
    width: 200,
    height: 60,
    field_name: "email",
  },
  {
    id: 5,
    shape: "text",
    text: "Drag me into the form ↓",
    x: 790,
    y: 80,
  },
  {
    id: 6,
    type: "textarea-container",
    shape: "rectangle",
    x: 740,
    y: 400,
    width: 320,
    height: 140,
    field_name: "message",
  },
  {
    id: 4,
    type: "button",
    shape: "rectangle",
    x: 240,
    y: 385,
    width: 200,
    height: 50,
    field_name: "Submit",
  },
];

export default function DemoSection() {
  const allData = useCanvasStore((s) => s.data);
  const previewItems = getInsideFormContainer(allData);

  return (
    <section className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-2 rounded rotate-[-4deg] mb-6 text-sm border border-black/10">
            interactive demo
          </div>
        </div>

        <div className="min-h-[700px]">
          <Canvas initialData={initialData} disableZoom nav={false} />
        </div>

        {/* sketchy arrow pointing down */}
        <div className="flex flex-col items-center py-8">
          <svg width="40" height="60" viewBox="0 0 40 60" className="text-black/30">
            <path d="M 20 0 Q 25 15 18 30 T 20 45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 22 0 Q 27 15 20 30 T 22 45" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3" />
            <polyline points="8,33 20,48 32,33" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="10,31 20,46 30,31" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
          </svg>
          <span className="text-sm text-black/40 mt-2 rotate-[-1deg]">
            Draw and check preview below
          </span>
        </div>

        <div className="max-w-2xl mx-auto"  style={{ marginTop: '20px' }}>
          <div className="paper-note p-8 relative" >
            <div className="masking-tape"></div>
            <h3 className="text-xl font-bold mb-6 text-black text-center">
              Form Preview
            </h3>
            {previewItems.length > 0 ? (
              <div className="flex flex-col gap-5">
                {previewItems.map((item) => {
                  const label = labelFromFieldName(item.field_name ?? "");
                  if (item.type === "input-container") {
                    return (
                      <label key={item.id} className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-black">{label}</span>
                        <wired-input placeholder={label} className="w-full"></wired-input>
                      </label>
                    );
                  }
                  if (item.type === "textarea-container") {
                    return (
                      <label key={item.id} className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-black">{label}</span>
                        <wired-textarea placeholder={label} rows={4} className="w-full"></wired-textarea>
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
            ) : (
              <div className="text-center py-12 text-black/40">
                <p className="text-4xl mb-3">✏️</p>
                <p>Draw a form container on the canvas, then add inputs, textareas, and buttons inside it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
