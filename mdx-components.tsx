import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import type { ReactNode } from "react"

function Callout({ children, type = "warn" }: { children: ReactNode; type?: "warn" | "info" }) {
  return (
    <div
      className={`my-4 rounded-lg border p-4 text-sm ${
        type === "warn"
          ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
          : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200"
      }`}
    >
      {children}
    </div>
  )
}

const components: MDXComponents = {
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  },
  Callout,
}

export function useMDXComponents(): MDXComponents {
  return components
}
