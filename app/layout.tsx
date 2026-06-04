import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

export const metadata: Metadata = {
  title: "Lookout — open source server monitoring & alerts",
  description:
    "Lookout watches memory, disk, CPU and your Docker containers — then pings you the second something crosses the line. One binary. No agents, no dashboards, no signup.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 36'%3E%3Ccircle cx='18' cy='18' r='15' fill='%23fff' stroke='%2315171A' stroke-width='6'/%3E%3Ccircle cx='46' cy='18' r='15' fill='%23fff' stroke='%2315171A' stroke-width='6'/%3E%3Ccircle cx='21' cy='14' r='6.5' fill='%2315171A'/%3E%3Ccircle cx='43' cy='14' r='6.5' fill='%2315171A'/%3E%3C/svg%3E",
  },
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
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
