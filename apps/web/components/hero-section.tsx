"use client";

export default function HeroSection() {
  return (
    <section className="min-h-[70vh] flex items-start justify-center px-6 pt-0 md:pt-17 relative">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #000 1px, transparent 1px), radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block rotate-[-6deg] px-4 py-2 rounded mb-8 text-sm font-bold tracking-wider uppercase">
          Form Sketching
        </div>

        <div className="text-7xl mb-6 rotate-[-4deg] inline-block select-none">
          ✏️
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none text-black">
          Sketch Forms
        </h1>

        <p className="text-xl md:text-2xl mb-10 text-black/60 max-w-2xl mx-auto leading-relaxed">
          Draw on canvas.
          <br />
          Get a working form URL instantly.
        </p>

        <div className="flex gap-5 justify-center flex-wrap">
          <wired-button
            className="primary rotate-[-2deg]"
            elevation={3}
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Drawing
          </wired-button>

          <wired-button
            className="outline rotate-[2deg]"
            elevation={2}
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How It Works
          </wired-button>
        </div>

        <div className="mt-16 flex justify-center gap-10 flex-wrap text-black/40 text-sm">
          <span>Instant Parsing</span>
          <span>Canvas Drawing</span>
          <span>Hosted Forms</span>
        </div>
      </div>
    </section>
  );
}
