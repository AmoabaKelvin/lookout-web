import { ImageResponse } from "next/og"

export const alt = "Lookout — open-source server monitoring & alerts"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BG = "#FBFAF7"
const INK = "#15171A"
const INK_2 = "#4B5159"
const INK_3 = "#8A8F96"
const ACCENT = "#E0493A"

async function loadFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+"
  )}:wght@${weight}`
  const css = await (await fetch(url)).text()
  const src = css.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype|woff2?)'\)/
  )
  if (!src) throw new Error(`Failed to load font: ${family} ${weight}`)
  return (await fetch(src[1])).arrayBuffer()
}

// One doodle eye, built from primitives so it matches the site logo exactly.
function Eye() {
  return (
    <div
      style={{
        width: 92,
        height: 92,
        borderRadius: 9999,
        backgroundColor: "#fff",
        border: `6px solid ${INK}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 40,
          height: 40,
          borderRadius: 9999,
          backgroundColor: INK,
          display: "flex",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 7,
            left: 7,
            width: 14,
            height: 14,
            borderRadius: 9999,
            backgroundColor: "#fff",
          }}
        />
      </div>
    </div>
  )
}

export default async function Image() {
  const [inter500, inter700] = await Promise.all([
    loadFont("Inter", 500),
    loadFont("Inter", 700),
  ])

  const tagline = "Know the moment your server starts to struggle."
  const words = tagline.split(" ")

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
          backgroundColor: BG,
          color: INK,
          fontFamily: "Inter",
          position: "relative",
          padding: 80,
        }}
      >
        {/* top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: ACCENT,
          }}
        />

        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 44,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundColor: ACCENT,
            }}
          />
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: 5,
              color: INK_2,
            }}
          >
            OPEN-SOURCE SERVER MONITORING
          </div>
        </div>

        {/* wordmark: l 👀 kout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: -3,
          }}
        >
          <span>l</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              margin: "0 8px",
            }}
          >
            <Eye />
            <Eye />
          </div>
          <span>kout</span>
        </div>

        {/* tagline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 860,
            marginTop: 40,
            fontSize: 40,
            fontWeight: 500,
            color: INK_2,
          }}
        >
          {words.map((w, i) => {
            const accent = w.startsWith("struggle")
            return (
              <span
                key={i}
                style={{
                  marginRight: 12,
                  color: accent ? ACCENT : INK_2,
                  fontWeight: accent ? 700 : 500,
                }}
              >
                {w}
              </span>
            )
          })}
        </div>

        {/* footer url */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 24,
            letterSpacing: 2,
            color: INK_3,
          }}
        >
          lookout.kelvinamoaba.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
        { name: "Inter", data: inter700, weight: 700, style: "normal" },
      ],
    }
  )
}
