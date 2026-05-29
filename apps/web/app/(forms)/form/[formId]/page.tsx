"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Canvas from "~/components/canvas/canvas"
import FormPreviewModal from "~/components/form-preview-modal"
import { useCanvasStore, getInsideFormContainer } from "~/store/canvasStore"
import 'wired-elements'

const Page = () => {
  const params = useParams().formId
  const [previewOpen, setPreviewOpen] = useState(false)

  const formId = Array.isArray(params) ? params[0] : params

  const formIdWithoutSlug = formId?.split("-").at(-1)

  const formName = formId
    ?.split("-")
    .slice(0, -1)
    .join("-")

  const allData = useCanvasStore((s) => s.data)
  const previewItems = getInsideFormContainer(allData)

  return (
    <><div className="grid h-full grid-rows-1 gap-4 md:grid-cols-3">
      <div className="col-span-2 rounded-xl bg-muted/50">
        <Canvas />
      </div>

      <div className="grid grid-rows-2 w-full gap-4">
        <div className="flex gap-2 w-full rounded-xl bg-muted/50 p-4 text-xl">
          <div className="min-w-[50%] space-y-1">
            {formIdWithoutSlug && (
              <p className="text-lg text-muted-foreground">id: {formIdWithoutSlug}</p>
            )}

            {formName && (
              <p className="text-lg text-muted-foreground">name: {formName}</p>
            )}

            {formId && (
              <div>
                <span className="text-xl font-semibold text-[#4F72FC]">Live at:</span>{" "}
                <a href={`${typeof window !== "undefined" ? window.location.origin : ""}/live/${formId}`} target="_blank" rel="noopener noreferrer" className="text-black underline hover:text-foreground">{typeof window !== "undefined" ? window.location.origin : ""}/live/{formId}</a>
              </div>
            )}
          </div>

          {/* right side */}
          <div className="flex flex-col  w-[50%] h-fit p-2 gap-3 items-end">
            <div className="flex gap-2 items-center">
              <label htmlFor="live-mode">
                Live
              </label>
              <wired-toggle checked={false}></wired-toggle>
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="unlisted-mode">
                Unlisted
              </label>
              <wired-toggle checked={false}></wired-toggle>
            </div>
          </div>
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
              <wired-card elevation={1} style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '40px', width: "90%" }}>
                <div style={{ display: 'flex', gap: '30px' }}>
                  <wired-input placeholder="Full name" disabled style={{ flex: 1 }}></wired-input>
                  <wired-input placeholder="Email" disabled style={{ flex: 1 }}></wired-input>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: "10px 0px" }}>
                  <wired-checkbox checked disabled></wired-checkbox>
                  <span style={{ fontSize: '13px', color: '#333' }}>Subscribe to newsletter</span>
                </div>
                <wired-button disabled style={{ width: '100%' }}>Submit</wired-button>
              </wired-card>
            </div>
          </div>
          <span className="relative z-20 mt-1 text-lg font-medium text-foreground">
            {formName || "Untitled Form"}
          </span>
        </button>
      </div>
    </div><FormPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        formName={formName}
        items={previewItems} /></>
  )
}

export default Page