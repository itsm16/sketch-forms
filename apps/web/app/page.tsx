"use client";

import "wired-elements";
import HeroSection from "~/components/hero-section";
import HowItWorksSection from "~/components/how-it-works-section";
import DemoSection from "~/components/demo-section";
import WhySection from "~/components/why-section";
import CTASection from "~/components/cta-section";

export default function Home() {
  return (
    <main className="min-h-screen paper-bg text-slate-800 overflow-hidden relative">
      <style>{`
        :root {
          --scrib-accent: #000000;
          --scrib-accent-light: #444444;
          --scrib-ink: #000000;
          --paper-bg: #fafaf8;
          --paper-line: rgba(0,0,0,0.06);
          --paper-spacing: 28px;
          --paper-margin: rgba(0,0,0,0.14);
          --paper-dot: rgba(0,0,0,0.02);
        }

        .paper-bg {
          background-color: var(--paper-bg);
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

        .paper-bg > * {
          position: relative;
          z-index: 1;
        }

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

      <HeroSection />
      <HowItWorksSection />
      <DemoSection />
      <WhySection />
      <CTASection />
    </main>
  );
}