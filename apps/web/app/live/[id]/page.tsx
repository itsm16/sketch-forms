"use client";

import dynamic from "next/dynamic";

const LiveForm = dynamic(() => import("./(form)"), { ssr: false });

export default function LiveFormPage() {
  return (
    <main className="min-h-screen paper-bg text-slate-800 overflow-hidden relative">
      <LiveForm />
    </main>
  );
}
