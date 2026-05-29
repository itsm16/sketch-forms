"use client";

import { BsClipboard2Check } from "react-icons/bs";
import { MdOutlineDraw, MdOutlineFormatListNumbered } from "react-icons/md";

const steps = [
  { emoji: <MdOutlineDraw size={32} />, title: "1. Draw", description: "Sketch your form layout on the canvas — inputs, buttons, text, and containers. No drag-and-drop limits." },
  { emoji: <MdOutlineFormatListNumbered size={32} />, title: "2. Arrange", description: "Select, drag, and position elements freely. Edit field names with a double-click. It's your canvas." },
  { emoji: <BsClipboard2Check size={32} />, title: "3. Publish", description: "Hit save and get a live URL instantly. Share your form with the world, no backend setup required." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-sm text-black/40 mb-3">
            Sketch → Form
          </p>

          <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
            From Doodle To Live form
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-black/60 leading-relaxed">
            Sketch Forms converts rough hand-drawn layouts into fully
            interactive forms automatically.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto paper-note p-8 relative">
          <div className="masking-tape"></div>
          {steps.map((step, i) => (
            <wired-card key={i} elevation={2} className="paper-note p-8 text-center relative">
              {step.emoji}
              <h3 className="text-2xl font-bold mb-3 text-black">{step.title}</h3>
              <p className="text-black/60 leading-relaxed">{step.description}</p>
            </wired-card>
          ))}
        </div>
      </div>
    </section>
  );
}
