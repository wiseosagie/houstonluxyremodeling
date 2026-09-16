import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#22201D",
          color: "#FAF7F2",
        }}
      >
        <div style={{ fontSize: 64, fontFamily: "Georgia, serif", letterSpacing: 6 }}>HOUSTON</div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 10,
            color: "#B9976B",
            marginTop: 18,
            textTransform: "uppercase",
          }}
        >
          Luxury Remodeling
        </div>
        <div style={{ fontSize: 20, color: "#C8BAA5", marginTop: 40, letterSpacing: 2 }}>
          Private Renovation Consultation
        </div>
      </div>
    ),
    { ...size }
  );
}
