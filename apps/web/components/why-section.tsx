"use client";

export default function WhySection() {
  return (
    <section className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto text-center">
        <p className="uppercase tracking-[0.3em] text-sm text-black/40 mb-3">
          why sketch forms
        </p>

        <h2 className="text-5xl md:text-6xl font-black mb-16 text-black">
          Fast. Simple. Sketchy.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="paper-note !p-8 text-center relative">
            <div className="masking-tape"></div>
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2 text-black">Freeform Canvas</h3>
            <p className="text-black/50 leading-relaxed">
              No rigid grids or drag-and-drop constraints. Draw exactly what you want, where you want it.
            </p>
          </div>

          <div className="paper-note !p-8 text-center relative">
            <div className="masking-tape"></div>
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2 text-black">Instant URL</h3>
            <p className="text-black/50 leading-relaxed">
              Every form gets a live URL immediately. Share it, embed it, done.
            </p>
          </div>

          <div className="paper-note !p-8 text-center relative">
            <div className="masking-tape"></div>
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="text-xl font-bold mb-2 text-black">Hand-Drawn Feel</h3>
            <p className="text-black/50 leading-relaxed">
              Wired Elements and Rough.js give every form that authentic sketchy, hand-drawn aesthetic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
