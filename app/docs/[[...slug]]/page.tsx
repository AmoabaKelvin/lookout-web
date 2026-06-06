import { notFound } from "next/navigation"

const DOCS_SLUGS = [
  "index",
  "installation",
  "configuration",
  "alerts",
  "notifications",
  "docker",
] as const

async function loadDoc(slug: string[] | undefined) {
  const pageSlug = slug?.join("/") || "index"

  if (!(DOCS_SLUGS as readonly string[]).includes(pageSlug)) notFound()

  return import(`@/content/docs/${pageSlug}.mdx`)
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const { default: Content, title, description } = await loadDoc(slug)

  return (
    <article>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-[var(--lk-ink)]">
        {title}
      </h1>
      <p className="mb-8 text-lg text-[var(--lk-ink-2)]">{description}</p>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <Content />
      </div>
    </article>
  )
}

export function generateStaticParams() {
  return DOCS_SLUGS.map((s) => ({ slug: s === "index" ? undefined : [s] }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const { title, description } = await loadDoc(slug)

  return { title, description }
}

export const dynamicParams = false
