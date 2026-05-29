"use client";

import { RoughNotation } from "react-rough-notation";
import "wired-elements";

export default function LiveForm() {
  return (
    <>
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

        .paper-card {
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

        .stamp {
          position: absolute;
          bottom: 24px;
          right: 24px;
          opacity: 0.08;
          font-size: 64px;
          transform: rotate(12deg);
          pointer-events: none;
          user-select: none;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.5);
          margin-bottom: 6px;
        }
      `}</style>

      <div className="fixed top-16 left-8 opacity-[0.04] text-7xl rotate-12 pointer-events-none select-none">
        ✏️
      </div>
      <div className="fixed bottom-10 right-10 opacity-[0.04] text-7xl -rotate-12 pointer-events-none select-none">
        📋
      </div>
      <div className="fixed top-1/3 right-12 opacity-[0.04] text-6xl rotate-6 pointer-events-none select-none">
        📎
      </div>

      <div className="min-h-screen flex flex-col items-center px-4 pt-10">
        <div className="w-full max-w-2xl mx-auto">
          <div className="paper-card relative p-8 md:p-12">
            <div className="masking-tape !bg-black/5"></div>

            <div className="text-center mb-10">
              <div className="text-5xl mb-4 inline-block rotate-[-4deg] select-none">
                📝
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black mb-2">
                Contact Form
              </h1>
              <p className="text-black/50 text-sm md:text-base">
                Drop us a note — we&apos;ll get back to you
              </p>
            </div>

              <RoughNotation type="box" show={true} animate={false} strokeWidth={1} padding={[10, 20]}>
              {/* form container */}
              <div className="space-y-8">
                <div>
                  <label className="form-label">Full Name</label>
                  <wired-input
                    placeholder="e.g. Ada Lovelace"
                    className="w-full"
                  ></wired-input>
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <wired-input
                    placeholder="you@example.com"
                    type="email"
                    className="w-full"
                  ></wired-input>
                </div>

                <div>
                  <label className="form-label">Subject</label>
                  <wired-input
                    placeholder="What's this about?"
                    className="w-full"
                  ></wired-input>
                </div>

                <div>
                  <label className="form-label">Message</label>
                  <wired-textarea
                    placeholder="Write your message here..."
                    rows={5}
                    className="w-full"
                  ></wired-textarea>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <wired-checkbox></wired-checkbox>
                  <span className="text-sm text-black/50">
                    Send me a copy of this message
                  </span>
                </div>

                <div className="flex gap-4 pt-4 justify-center">
                  <wired-button className="primary" elevation={2}>
                    Send Message
                  </wired-button>
                  <wired-button className="outline" elevation={1}>
                    Clear
                  </wired-button>
                </div>
              </div>
              </RoughNotation>

            <div className="stamp">✓</div>
          </div>

          <p className="text-center text-black/30 text-xs mt-8">
            Sketch Forms &mdash; hand-crafted with care
          </p>
        </div>
      </div>
    </>
  );
}
