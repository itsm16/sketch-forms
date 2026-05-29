"use client";

import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <>
      <section className="py-32 px-6 text-center relative">
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-block px-4 py-2 rounded rotate-[4deg] mb-6 text-sm border border-black/10">
            ready to scribble?
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 text-black">
            Draw.
            <br />
            Parse.
            <br />
            Publish.
          </h2>

          <p className="text-lg text-black/50 mb-12 max-w-xl mx-auto leading-relaxed">
            Stop wrestling with rigid form builders. Sketch your idea
            naturally and let Sketch Forms handle the rest.
          </p>

          <div className="flex gap-5 justify-center flex-wrap">
            <wired-button
              className="primary rotate-[-2deg]"
              elevation={3}
              onClick={() => router.push("/new")}
            >
              Get Started Free
            </wired-button>

            <wired-button
              elevation={2}
              className="rotate-[2deg]"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              View on GitHub
            </wired-button>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 text-center text-black/40 text-sm border-t border-black/10">
        <p>Built with pencil using Wired Elements & sketchy vibes</p>
      </footer>
    </>
  );
}
