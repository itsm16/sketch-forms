"use client";

import type { FormTheme, SuccessAnimation } from "~/lib/form-themes";

const CONFETTI_COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcB77",
  "#4d96ff",
  "#c77dff",
  "#ff9f1c",
];

export function FormSuccess({
  animation,
  theme,
  title = "Thanks for your response!",
  message = "Your answer has been recorded.",
}: {
  animation: SuccessAnimation;
  theme: FormTheme;
  title?: string;
  message?: string;
}) {
  const isMidnight = theme === "midnight";
  const isPaper = theme === "paper";

  const titleClass = isPaper
    ? "text-3xl font-black text-black"
    : isMidnight
      ? "text-3xl font-bold text-white"
      : "text-3xl font-semibold tracking-tight text-slate-900";

  const messageClass = isPaper
    ? "mt-2 text-black/50"
    : isMidnight
      ? "mt-2 text-slate-400"
      : "mt-2 text-slate-500";

  return (
    <div className="relative overflow-hidden py-12 text-center">
      <style>{`
        @keyframes sketch-confetti-fall {
          0% { transform: translateY(-24px) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateY(240px) rotate(560deg); opacity: 0; }
        }
        .sketch-confetti-piece {
          position: absolute;
          top: 0;
          width: 8px;
          height: 13px;
          border-radius: 2px;
          animation-name: sketch-confetti-fall;
          animation-timing-function: ease-in;
          animation-iteration-count: 1;
          animation-fill-mode: both;
        }
        @keyframes sketch-check-draw {
          to { stroke-dashoffset: 0; }
        }
        .sketch-check-circle {
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          animation: sketch-check-draw 0.6s ease-out forwards;
        }
        .sketch-check-mark {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: sketch-check-draw 0.35s ease-out 0.55s forwards;
        }
        @keyframes sketch-sparkle-pop {
          0%, 100% { transform: scale(0.85) rotate(-8deg); opacity: 0.55; }
          50% { transform: scale(1.15) rotate(8deg); opacity: 1; }
        }
        .sketch-sparkle {
          display: inline-block;
          animation: sketch-sparkle-pop 1.3s ease-in-out infinite;
        }
      `}</style>

      {animation === "confetti" && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56">
          {Array.from({ length: 22 }).map((_, index) => (
            <span
              key={index}
              className="sketch-confetti-piece"
              style={{
                left: `${(index * 37 + 11) % 100}%`,
                backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                animationDelay: `${(index % 7) * 0.11}s`,
                animationDuration: `${1.15 + (index % 5) * 0.13}s`,
              }}
            />
          ))}
        </div>
      )}

      {animation === "check" && (
        <svg
          viewBox="0 0 100 100"
          className={`mx-auto mb-5 h-20 w-20 ${
            isMidnight ? "text-emerald-400" : "text-emerald-500"
          }`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle
            className="sketch-check-circle"
            cx="50"
            cy="50"
            r="45"
            strokeWidth="4"
          />
          <path
            className="sketch-check-mark"
            d="M30 51 L44 65 L71 36"
            strokeWidth="5"
          />
        </svg>
      )}

      {animation === "sparkle" && (
        <div
          className={`mb-5 flex justify-center gap-3 text-4xl md:text-5xl ${
            isMidnight ? "text-amber-300" : "text-amber-500"
          }`}
          aria-hidden="true"
        >
          <span className="sketch-sparkle" style={{ animationDelay: "0s" }}>
            ✦
          </span>
          <span
            className="sketch-sparkle text-5xl md:text-6xl"
            style={{ animationDelay: "0.18s" }}
          >
            ✧
          </span>
          <span className="sketch-sparkle" style={{ animationDelay: "0.36s" }}>
            ✦
          </span>
        </div>
      )}

      <h2 className={titleClass}>{title}</h2>
      <p className={messageClass}>{message}</p>
    </div>
  );
}
