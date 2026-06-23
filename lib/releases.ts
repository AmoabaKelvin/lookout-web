import { GITHUB_URL } from "@/lib/site"

export type Release = {
  version: string
  url: string
}

const REPO_SLUG = GITHUB_URL.replace("https://github.com/", "")

// Shown when the GitHub API is unreachable or rate-limited so the docs sidebar
// always renders at least one release.
const FALLBACK: Release[] = [
  { version: "v0.0.1", url: `${GITHUB_URL}/releases/tag/v0.0.1` },
]

type GitHubRelease = {
  tag_name: string
  html_url: string
  draft: boolean
}

// Published releases from GitHub, newest first. Cached for an hour (ISR) so the
// docs pages stay static and we don't hit GitHub's rate limit on every request.
export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_SLUG}/releases?per_page=10`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) return FALLBACK
    const data = (await res.json()) as GitHubRelease[]
    const releases = data
      .filter((r) => !r.draft)
      .map((r) => ({ version: r.tag_name, url: r.html_url }))
    return releases.length > 0 ? releases : FALLBACK
  } catch {
    return FALLBACK
  }
}
