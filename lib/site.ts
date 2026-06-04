export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://lookout-web-bay.vercel.app"

export const SITE_NAME = "Lookout"

export const SITE_TITLE = "Lookout — open-source server monitoring & alerts"

export const SITE_DESCRIPTION =
  "Lookout is a lightweight, open-source tool that watches memory, disk, CPU and Docker — and alerts you the moment something crosses your thresholds. One binary, no agents, no signup."

export const GITHUB_URL = "https://github.com/AmoabaKelvin/lookout"
