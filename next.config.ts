import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@libsql/**/*"],
  },
}

export default withMDX(nextConfig)

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
initOpenNextCloudflareForDev()
