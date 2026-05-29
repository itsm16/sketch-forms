"use client";

import "wired-elements";

const templates = [
  {
    title: "Contact Form",
    description: "Name, email, subject & message fields",
  },
  {
    title: "Feedback Survey",
    description: "Rating, comments & optional email",
  },
  {
    title: "Event Registration",
    description: "Name, email, phone & event selection",
  },
  {
    title: "Product Feedback",
    description: "Rating, comments & optional email",
  },
  {
    title: "Job Application",
    description: "Resume, cover letter & references",
  },
  {
    title: "Booking Request",
    description: "Service, date, time & notes",
  },
  {
    title: "Support Ticket",
    description: "Category, priority & description",
  },
  {
    title: "Newsletter Signup",
    description: "Email, name & preferences",
  },
  {
    title: "Order Form",
    description: "Product, quantity & shipping",
  },
];

export default function TemplatesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 h-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Start with a pre-built form template.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-4">
          {templates.map((t) => (
            <wired-card
              key={t.title}
              elevation={2}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              style={{
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                background: "#fff",
              }}
            >
              <h2 className="text-sm font-bold">{t.title}</h2>
              <p className="text-[11px] text-muted-foreground leading-tight">{t.description}</p>

              <div
                className="rounded-lg p-2 pointer-events-none"
                style={{ transformOrigin: "top left", width: "max-content", margin: "8px auto" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <wired-input placeholder="Full name" disabled></wired-input>
                  <wired-input placeholder="Email" type="email" disabled></wired-input>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <wired-checkbox checked disabled></wired-checkbox>
                    <span className="text-[10px] text-muted-foreground">Send me a copy</span>
                  </div>
                  <wired-button disabled style={{ width: "100%", fontSize: "11px" }}>
                    Submit
                  </wired-button>
                </div>
              </div>

              <wired-button elevation={1} style={{ width: "100%", fontSize: "12px", padding: "2px 0" }}>
                Use Template
              </wired-button>
            </wired-card>
          ))}
        </div>
      </div>
    </div>
  );
}
