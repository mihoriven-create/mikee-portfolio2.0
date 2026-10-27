import { ImageResponse } from "next/og";

export const alt = "Michael John Buencamino — CRM & Technical Operations Specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const steps = ["Trigger", "Opportunity", "Tag", "Slack", "Notify", "Done"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#07080a",
          color: "#f2f3f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 3, color: "#a7acb4" }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: "#8be3f7" }} />
          CRM & TECHNICAL OPERATIONS SPECIALIST
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.95 }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: "#a7acb4" }}>MICHAEL JOHN</div>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -4 }}>BUENCAMINO</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", position: "relative", height: 14, alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 6, height: 2, background: "linear-gradient(90deg, #22262c, #8be3f7)" }} />
            {steps.map((s, i) => (
              <div
                key={s}
                style={{
                  position: "absolute",
                  left: `${(i / (steps.length - 1)) * 98}%`,
                  width: 14,
                  height: 14,
                  borderRadius: 99,
                  background: i === steps.length - 1 ? "#8be3f7" : "#07080a",
                  border: "2px solid #8be3f7",
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 26, color: "#a7acb4" }}>
            CRM systems · Workflow automation · AI · API & webhook integrations
          </div>
        </div>
      </div>
    ),
    size,
  );
}
