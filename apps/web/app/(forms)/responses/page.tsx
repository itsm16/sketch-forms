"use client";

import { FormsTable } from "~/components/Table"

export default function ResponsesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Form Responses</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage all your form submissions.
        </p>
      </div>

      <wired-card className="max-h-[90%] min-h-[80%] overflow-y-auto rounded-xl p-3">
        <FormsTable showLive={false} />
      </wired-card>
    </div>
  )
}
