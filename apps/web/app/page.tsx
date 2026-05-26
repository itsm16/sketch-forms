"use client";

import { useEffect, useState } from "react";
import "wired-elements";

export default function Home() {
  const [spinning, setSpinning] = useState(false);
  const [demoForm, setDemoForm] = useState(false);

  useEffect(() => {
    const el = document.querySelector("wired-spinner");

    if (el) {
      (el as any).spinning = spinning;
    }
  }, [spinning]);

  const handleParse = () => {
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      setDemoForm(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen paper-bg text-slate-800 overflow-hidden relative">
      <style>{`
        :root {
          --scrib-accent: #000000;
          --scrib-accent-light: #444444;
          --scrib-ink: #000000;
          --paper-bg: #fafaf8;
          --paper-line: rgba(0,0,0,0.06); /* horizontal rule color */
          --paper-spacing: 28px; /* distance between ruled lines */
          --paper-margin: rgba(0,0,0,0.14); /* left margin vertical line */
          --paper-dot: rgba(0,0,0,0.02);
        }

        /* Main paper background with clear horizontal ruled lines */
        .paper-bg {
          background-color: var(--paper-bg);
          /* Layer 1: thin dots/grain (subtle) */
          /* Layer 2: repeating horizontal lines */
          /* Layer 3: left vertical margin line */
          background-image:
            radial-gradient(circle at 10% 10%, var(--paper-dot) 0.5px, transparent 0.6px),
            repeating-linear-gradient(
              to bottom,
              var(--paper-line) 0px,
              var(--paper-line) 1px,
              transparent 1px,
              transparent var(--paper-spacing)
            ),
            linear-gradient(
              to right,
              transparent 48px,
              var(--paper-margin) 49px,
              transparent 50px
            );

          background-position: left top, left top, left top;
          background-size: 60px 60px, 100% var(--paper-spacing), 100% 100%;

          color: var(--scrib-ink);
        }

        /* Make sure content is above subtle overlays */
        .paper-bg > * {
          position: relative;
          z-index: 1;
        }

        /* Slight vignette to mimic paper edge (very subtle) */
        .paper-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(0,0,0,0.01), transparent 15%, transparent 85%, rgba(0,0,0,0.01));
          z-index: 0;
        }

        wired-card {
          display: block;
          width: 100%;
          padding: 18px;
          background: transparent;
          color: var(--scrib-ink);
          --wired-elements-fill: transparent;
        }

        wired-button {
          --wired-elements-fill: #000000;
          --wired-elements-color: #ffffff;
          font-weight: 700;
          border-radius: 6px;
          transition: transform 0.2s ease;
        }

        wired-button:hover {
          transform: translateY(-2px);
        }

        wired-button.primary {
          --wired-elements-fill: #000000;
          --wired-elements-color: #ffffff;
        }

        wired-button.outline {
          --wired-elements-fill: transparent;
          --wired-elements-color: #000000;
        }

        wired-input,
        wired-textarea {
          --wired-elements-fill: rgba(255,255,255,0.92);
          --wired-elements-color: #000000;
          width: 100%;
          border-radius: 6px;
          padding: 8px;
        }

        wired-divider {
          --wired-elements-color: rgba(0,0,0,0.15);
          display: block;
          width: 100%;
        }

        .paper-note {
          background: #ffffff;
          border-radius: 20px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06),
            inset 0 0 0 1px rgba(0,0,0,0.04);
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0.025) 0px,
            rgba(0,0,0,0.025) 1px,
            transparent 1px,
            transparent 26px
          );
          background-size: 100% 26px;
        }

        .scribble-arrow {
          position: absolute;
          font-size: 48px;
          opacity: 0.06;
          user-select: none;
        }

        .sticky {
          background: #f5f5f5;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .masking-tape {
          position: absolute;
          width: 80px;
          height: 20px;
          background: rgba(200,200,200,0.4);
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          border-radius: 4px;
          backdrop-filter: blur(2px);
        }
      `}</style>

      {/* floating decorations */}
      <div className="fixed top-16 left-8 opacity-[0.04] text-7xl rotate-12 pointer-events-none select-none">
        ✏️
      </div>

      <div className="fixed bottom-10 right-10 opacity-[0.04] text-7xl -rotate-12 pointer-events-none select-none">
        📄
      </div>

      <div className="fixed top-1/2 left-10 opacity-[0.04] text-6xl rotate-6 pointer-events-none select-none">
        ✂️
      </div>

      {/* HERO */}
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
            AI Powered Form Sketching
          </div>

          <div className="text-7xl mb-6 rotate-[-4deg] inline-block select-none">
            ✏️
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none text-black">
            Sketch Forms
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-black/60 max-w-2xl mx-auto leading-relaxed">
            Draw on canvas. Click parse.
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
                  .getElementById("features")
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

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.3em] text-sm text-black/40 mb-3">
              Sketch → AI → Form
            </p>

            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
              From Doodle To Deployment
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-black/60 leading-relaxed">
              Sketch Forms converts rough hand-drawn layouts into fully
              interactive forms automatically.
            </p>
          </div>

          gotta add
        </div>
      </section>

      {/* DEMO */}
      <section className="py-28 px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-2 rounded rotate-[-4deg] mb-6 text-sm border border-black/10">
            interactive demo
          </div>

          gotta add
        </div>
      </section>

      {/* why - fast , quick */}

      {/* CTA */}
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
            >
              Get Started Free
            </wired-button>

            <wired-button
              elevation={2}
              className="rotate-[2deg]"
            >
              View on GitHub
            </wired-button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 text-center text-black/40 text-sm border-t border-black/10">
        <p>Built with pencil using Wired Elements & sketchy vibes</p>
      </footer>
    </main>
  );
}