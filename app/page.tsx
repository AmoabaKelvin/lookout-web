import Link from "next/link"

import { Button } from "@/components/ui/button"
import { InstallCommand } from "@/components/install-command"
import { SiteNav } from "@/components/site-nav"
import {
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Lookout",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux (amd64, arm64)",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      downloadUrl: GITHUB_URL,
      softwareHelp: GITHUB_URL,
      license: `${GITHUB_URL}/blob/main/LICENSE`,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: {
        "@type": "Person",
        name: "Kelvin Amoaba",
        url: "https://github.com/AmoabaKelvin",
      },
    },
  ],
}

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Memory",
    body: "Catch leaks and runaway processes before the OOM killer does it for you.",
  },
  {
    title: "Disk",
    body: "Know before a volume fills up and writes start silently failing.",
  },
  {
    title: "CPU & load",
    body: "Spot sustained spikes and load averages that keep climbing past your cores.",
  },
  {
    title: "Docker containers",
    body: "Get pinged the instant a container exits, restarts, or starts thrashing.",
  },
  {
    title: "Endpoints & ports",
    body: "Ping an HTTP endpoint or TCP port and hear about it the moment it stops answering.",
  },
  {
    title: "Custom thresholds",
    body: "Define your own checks in plain YAML. Any metric, any limit, any interval.",
  },
]

const STEPS: { num: string; title: string; body: string }[] = [
  {
    num: "01",
    title: "Install",
    body: "One command drops a single static binary on any Linux box. No runtime, no dependencies, no account.",
  },
  {
    num: "02",
    title: "Point it at what matters",
    body: "Pick your thresholds — or keep the sensible defaults. Watch a host, a path, a port, or a container.",
  },
  {
    num: "03",
    title: "Get alerted",
    body: "Lookout only speaks up when a threshold is crossed — then once more when things recover.",
  },
]

const CHANNELS = [
  "Slack",
  "Discord",
  "Telegram",
  "Google Chat",
  "Microsoft Teams",
  "PagerDuty",
  "Email",
  "Webhooks",
]

function Eyebrow({
  children,
  dot = false,
}: {
  children: React.ReactNode
  dot?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-[var(--lk-ink-3)] uppercase">
      {dot && (
        <span className="size-[5px] rounded-full bg-[var(--lk-accent)]" />
      )}
      {children}
    </span>
  )
}

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="max-w-[52ch]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[clamp(1.55rem,2.8vw,1.95rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">
        {title}
      </h2>
      {children && (
        <p className="mt-3 text-[15px] leading-[1.6] text-[var(--lk-ink-2)]">
          {children}
        </p>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div className="min-h-svh bg-[var(--lk-bg)] text-[var(--lk-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />

      {/* ============ HERO ============ */}
      <header id="install">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center px-6 pt-28 pb-28 text-center max-[560px]:pt-20 max-[560px]:pb-20">
          <Eyebrow dot>Open-source server monitoring</Eyebrow>
          <h1 className="mt-6 max-w-[17ch] text-[clamp(2.4rem,5.6vw,3.8rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
            Know the moment your server starts to struggle.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[clamp(1rem,1.4vw,1.1rem)] leading-[1.6] text-[var(--lk-ink-2)]">
            Lookout watches memory, disk, CPU and your Docker containers — then
            pings you the second something crosses the line. One binary. No
            agents, no dashboards to babysit, no signup.
          </p>

          <InstallCommand className="mt-9 w-[min(540px,100%)]" />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[12px] text-[var(--lk-ink-3)]">
            <span>MIT licensed</span>
            <span aria-hidden>·</span>
            <span>Single ~9MB binary</span>
            <span aria-hidden>·</span>
            <span>Linux · arm64 · amd64</span>
          </div>

          <div className="mt-9 flex items-center gap-6 text-[14px]">
            <a
              href={GITHUB_URL}
              className="text-[var(--lk-ink-2)] underline decoration-[var(--lk-line)] underline-offset-4 transition-colors hover:text-[var(--lk-ink)] hover:decoration-[var(--lk-ink-3)]"
            >
              Star on GitHub
            </a>
            <Link
              href="/docs"
              className="text-[var(--lk-ink-2)] underline decoration-[var(--lk-line)] underline-offset-4 transition-colors hover:text-[var(--lk-ink)] hover:decoration-[var(--lk-ink-3)]"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </header>

      {/* ============ FEATURES ============ */}
      <section id="features" className="border-t border-[var(--lk-line)]">
        <div className="mx-auto max-w-[1040px] px-6 py-24 max-[560px]:py-16">
          <SectionHeader
            eyebrow="What it watches"
            title="Everything that takes a server down at 3am."
          >
            The checks you&apos;d otherwise cobble together from scripts and
            cron jobs — running out of the box, watching the things that
            actually page you.
          </SectionHeader>

          <div className="mt-14 grid grid-cols-3 gap-x-10 gap-y-12 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-y-9">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="border-t border-[var(--lk-line)] pt-5"
              >
                <h3 className="text-[15px] font-medium">{f.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[var(--lk-ink-2)]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HEARTBEAT / DEAD-MAN'S SWITCH ============ */}
      <section id="heartbeat" className="border-t border-[var(--lk-line)]">
        <div className="mx-auto grid max-w-[1040px] grid-cols-2 items-center gap-16 px-6 py-24 max-[860px]:grid-cols-1 max-[860px]:gap-10 max-[560px]:py-16">
          <div>
            <SectionHeader
              eyebrow="Dead-man's switch"
              title="And when the whole box goes dark?"
            >
              If the machine dies, the network drops, or Lookout itself stops,
              the agent can&apos;t send a thing. A hosted heartbeat monitor
              expects a regular ping — and tells you the moment one stops
              arriving.
            </SectionHeader>
            <ol className="mt-6 space-y-2.5 text-[14.5px] leading-[1.6] text-[var(--lk-ink-2)]">
              {[
                "Create a heartbeat monitor in your dashboard.",
                "Paste its ping URL into your Lookout config.",
                "Get alerted the instant pings go silent — and again when they resume.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-px font-mono text-[12px] text-[var(--lk-ink-3)]">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button
                render={<Link href="/dashboard" />}
                nativeButton={false}
                className="bg-[var(--lk-ink)] text-white hover:bg-[color-mix(in_oklab,var(--lk-ink),#fff_14%)]"
              >
                Create a heartbeat monitor
              </Button>
              <Link
                href="/docs/heartbeat"
                className="text-[14px] text-[var(--lk-ink-2)] underline decoration-[var(--lk-line)] underline-offset-4 transition-colors hover:text-[var(--lk-ink)] hover:decoration-[var(--lk-ink-3)]"
              >
                Read the guide
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-[#26292e] bg-[#101214]">
            <div className="flex items-center gap-1.5 border-b border-[#26292e] px-4 py-2.5">
              <span className="size-2 rounded-full bg-[#3a3e44]" />
              <span className="size-2 rounded-full bg-[#3a3e44]" />
              <span className="size-2 rounded-full bg-[#3a3e44]" />
              <span className="ml-2 font-mono text-[11px] text-[#7d8590]">
                /etc/lookout/config.yaml
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-[#cfcdc8]">
              <code>
                <span className="text-[#6e7681]"># dead-man&apos;s switch</span>
                {"\n"}
                <span className="text-[#7ee787]">heartbeat:</span>
                {"\n  "}
                <span className="text-[#7ee787]">url:</span>{" "}
                &quot;https://lookout.kelvinamoaba.com/ping/lk_ping_…&quot;
                {"\n  "}
                <span className="text-[#7ee787]">interval:</span> 60s
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="border-t border-[var(--lk-line)]">
        <div className="mx-auto max-w-[1040px] px-6 py-24 max-[560px]:py-16">
          <SectionHeader eyebrow="How it works" title="Up and running in one command.">
            No control plane to deploy, no time-series database to feed.
            Install the binary, point it at what matters, and get out of the
            way.
          </SectionHeader>

          <div className="mt-14 grid grid-cols-3 gap-x-10 gap-y-12 max-[860px]:grid-cols-1 max-[860px]:gap-y-9">
            {STEPS.map((s) => (
              <div key={s.num} className="border-t border-[var(--lk-line)] pt-5">
                <span className="font-mono text-[12px] text-[var(--lk-ink-3)]">
                  {s.num}
                </span>
                <h3 className="mt-3 text-[15px] font-medium">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[var(--lk-ink-2)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ALERT CHANNELS ============ */}
      <section id="alerts" className="border-t border-[var(--lk-line)]">
        <div className="mx-auto max-w-[1040px] px-6 py-24 max-[560px]:py-16">
          <SectionHeader
            eyebrow="Where alerts land"
            title="Get told where you'll actually see it."
          >
            Route every alert to the place your team already lives. Mix and
            match as many channels as you like.
          </SectionHeader>

          <div className="mt-14 grid grid-cols-4 gap-x-10 gap-y-9 max-[860px]:grid-cols-2">
            {CHANNELS.map((name, i) => (
              <div
                key={name}
                className="flex items-baseline justify-between gap-4 border-t border-[var(--lk-line)] pt-4"
              >
                <span className="text-[14.5px] font-medium">{name}</span>
                <span className="font-mono text-[12px] text-[var(--lk-ink-3)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[14px] text-[var(--lk-ink-3)]">
            Eight destinations built in — and anything else you can reach with
            a{" "}
            <code className="rounded-[4px] bg-[var(--lk-line-2)] px-1.5 py-0.5 font-mono text-[12.5px] text-[var(--lk-ink-2)]">
              POST
            </code>
            .
          </p>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="border-t border-[var(--lk-line)]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center px-6 py-24 text-center max-[560px]:py-16">
          <Eyebrow dot>Free &amp; open source</Eyebrow>
          <h2 className="mt-4 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.3rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            Start watching your server in 30 seconds.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-[var(--lk-ink-2)]">
            One command on the box you want to keep alive. Star it on GitHub if
            it saves your weekend.
          </p>

          <InstallCommand className="mt-8 w-[min(540px,100%)]" />

          <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
            <Button
              render={<a href={GITHUB_URL} />}
              nativeButton={false}
              className="bg-[var(--lk-ink)] text-white hover:bg-[color-mix(in_oklab,var(--lk-ink),#fff_14%)]"
            >
              View on GitHub
            </Button>
            <Link
              href="/docs"
              className="text-[14px] text-[var(--lk-ink-2)] underline decoration-[var(--lk-line)] underline-offset-4 transition-colors hover:text-[var(--lk-ink)] hover:decoration-[var(--lk-ink-3)]"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[var(--lk-line)]">
        <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-9">
          <span className="font-mono text-[12px] text-[var(--lk-ink-3)]">
            © 2026 Lookout · MIT licensed
          </span>
          <div className="flex flex-wrap items-center gap-6 text-[13.5px]">
            {(
              [
                ["Docs", "/docs"],
                ["GitHub", GITHUB_URL],
                ["Releases", `${GITHUB_URL}/releases`],
                ["Issues", `${GITHUB_URL}/issues`],
              ] as const
            ).map(([label, href]) => {
              const Component = href.startsWith("/") ? Link : "a"
              return (
                <Component
                  key={label}
                  href={href}
                  className="text-[var(--lk-ink-2)] transition-colors hover:text-[var(--lk-ink)]"
                >
                  {label}
                </Component>
              )
            })}
          </div>
        </div>
      </footer>
    </div>
  )
}
