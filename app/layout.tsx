import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" })

const TITLE = SITE_TITLE
const DESCRIPTION = SITE_DESCRIPTION

const EYES_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 36'%3E%3Ccircle cx='18' cy='18' r='15' fill='%23fff' stroke='%2315171A' stroke-width='6'/%3E%3Ccircle cx='46' cy='18' r='15' fill='%23fff' stroke='%2315171A' stroke-width='6'/%3E%3Ccircle cx='21' cy='14' r='6.5' fill='%2315171A'/%3E%3Ccircle cx='43' cy='14' r='6.5' fill='%2315171A'/%3E%3C/svg%3E"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Lookout",
  },
  description: DESCRIPTION,
  applicationName: "Lookout",
  category: "technology",
  keywords: [
    "server monitoring",
    "open source monitoring",
    "self-hosted monitoring",
    "server alerts",
    "Docker container monitoring",
    "disk usage alerts",
    "CPU and memory monitoring",
    "Linux server monitoring",
    "uptime monitoring",
    "Netdata alternative",
    "Lookout",
  ],
  authors: [{ name: "Kelvin Amoaba", url: "https://github.com/AmoabaKelvin" }],
  creator: "Kelvin Amoaba",
  publisher: "Lookout",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Lookout",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: EYES_FAVICON, type: "image/svg+xml" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#FBFAF7",
  colorScheme: "light",
}

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased font-sans", geistSans.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
