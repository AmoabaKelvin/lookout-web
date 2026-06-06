import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Activity01Icon,
  ChartLineData01Icon,
  ChipIcon,
  ContainerIcon,
  Database01Icon,
  DiscordIcon,
  Download01Icon,
  Github01Icon,
  Mail01Icon,
  MatrixIcon,
  Megaphone01Icon,
  Message01Icon,
  Message02Icon,
  MicrosoftIcon,
  Notification01Icon,
  Notification03Icon,
  Settings02Icon,
  Shield01Icon,
  SlackIcon,
  SlidersHorizontalIcon,
  SmartPhone01Icon,
  TelegramIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { InstallCommand } from "@/components/install-command"
import { LookoutLogo } from "@/components/lookout-logo"
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[12.5px] font-medium tracking-[0.12em] text-[var(--lk-ink-2)] uppercase">
      <span className="size-[7px] rounded-full bg-[var(--lk-accent)] shadow-[0_0_0_4px_var(--lk-accent-tint)]" />
      {children}
    </span>
  )
}

const FEATURES: { icon: IconSvgElement; title: string; body: string }[] = [
  {
    icon: ChipIcon,
    title: "Memory",
    body: "Catch leaks and runaway processes before the OOM killer does it for you.",
  },
  {
    icon: Database01Icon,
    title: "Disk",
    body: "Know before a volume fills up and writes start silently failing.",
  },
  {
    icon: ChartLineData01Icon,
    title: "CPU & load",
    body: "Spot sustained spikes and load averages that keep climbing past your cores.",
  },
  {
    icon: ContainerIcon,
    title: "Docker containers",
    body: "Get pinged the instant a container exits, restarts, or starts thrashing.",
  },
  {
    icon: Activity01Icon,
    title: "Endpoints & ports",
    body: "Ping an HTTP endpoint or TCP port and hear about it the moment it stops answering.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Custom thresholds",
    body: "Define your own checks in plain YAML. Any metric, any limit, any interval.",
  },
]

const STEPS: {
  icon: IconSvgElement
  anim: "download" | "spin" | "ring"
  num: string
  title: string
  body: string
}[] = [
  {
    icon: Download01Icon,
    anim: "download",
    num: "Step 01",
    title: "Install",
    body: "One command drops a single static binary on any Linux box — no runtime, no dependencies, no account.",
  },
  {
    icon: Settings02Icon,
    anim: "spin",
    num: "Step 02",
    title: "Point it at what matters",
    body: "Pick your thresholds — or keep the sensible defaults. Watch a host, a path, a port, or a container.",
  },
  {
    icon: Notification03Icon,
    anim: "ring",
    num: "Step 03",
    title: "Get alerted",
    body: "Lookout only speaks up when a threshold is crossed — then once more when things recover.",
  },
]

const CHANNELS_A: { icon: IconSvgElement; name: string }[] = [
  { icon: SlackIcon, name: "Slack" },
  { icon: Mail01Icon, name: "Email" },
  { icon: DiscordIcon, name: "Discord" },
  { icon: Notification03Icon, name: "PagerDuty" },
  { icon: TelegramIcon, name: "Telegram" },
  { icon: WebhookIcon, name: "Webhook" },
  { icon: MicrosoftIcon, name: "Microsoft Teams" },
]

const CHANNELS_B: { icon: IconSvgElement; name: string }[] = [
  { icon: Shield01Icon, name: "Opsgenie" },
  { icon: Notification01Icon, name: "ntfy" },
  { icon: Message02Icon, name: "SMS" },
  { icon: Message01Icon, name: "Mattermost" },
  { icon: SmartPhone01Icon, name: "Pushover" },
  { icon: MatrixIcon, name: "Matrix" },
  { icon: Megaphone01Icon, name: "Gotify" },
]

function ChannelPill({ icon, name }: { icon: IconSvgElement; name: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-3 rounded-full border border-[var(--lk-line)] bg-[var(--lk-surface)] py-3.5 pr-6 pl-[19px] text-[1.05rem] font-medium whitespace-nowrap transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#d8d4cb] hover:shadow-[0_10px_26px_-18px_rgba(20,22,26,0.55)]">
      <HugeiconsIcon
        icon={icon}
        size={23}
        strokeWidth={1.7}
        className="shrink-0 text-[var(--lk-ink-2)]"
      />
      {name}
    </span>
  )
}

export default function Page() {
  return (
    <div className="min-h-svh bg-[var(--lk-bg)] text-[var(--lk-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav logoHref="#install" />

      {/* ============ HERO (minimal) ============ */}
      <header
        id="install"
        className="relative overflow-hidden border-b border-[var(--lk-line)]"
      >
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-70 [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--lk-ink),transparent_92%)_1px,transparent_0)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_30%,transparent_75%)]"
        />
        <div className="relative z-10 mx-auto flex max-w-[1140px] flex-col items-center px-10 pt-[104px] pb-[110px] text-center max-[920px]:px-6 max-[560px]:pt-[72px] max-[560px]:pb-[78px]">
          <Eyebrow>Open-source server monitoring</Eyebrow>
          <h1 className="mt-[26px] max-w-[16ch] text-[clamp(2.6rem,5.6vw,4.3rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
            Know the moment your server starts to{" "}
            <span className="text-[var(--lk-accent-strong)]">struggle</span>.
          </h1>
          <p className="mt-6 max-w-[54ch] text-[clamp(1.05rem,1.6vw,1.22rem)] leading-[1.55] text-[var(--lk-ink-2)]">
            Lookout watches memory, disk, CPU and your Docker containers — then
            pings you the second something crosses the line. One binary. No
            agents, no dashboards to babysit, no signup.
          </p>

          <InstallCommand className="mt-[38px] w-[min(560px,100%)]" />

          <div className="mt-[22px] flex flex-wrap items-center justify-center gap-[18px] font-mono text-[12.5px] text-[var(--lk-ink-3)]">
            <span>MIT licensed</span>
            <span className="size-1 rounded-full bg-[var(--lk-line)]" />
            <span>Single ~9MB binary</span>
            <span className="size-1 rounded-full bg-[var(--lk-line)]" />
            <span>Linux · arm64 · amd64</span>
          </div>

          <div className="mt-[34px] flex flex-wrap items-center justify-center gap-3.5">
            <Button
              variant="outline"
              render={<a href={GITHUB_URL} />}
              nativeButton={false}
            >
              <HugeiconsIcon icon={Github01Icon} size={17} />
              Star on GitHub
            </Button>
            <Button variant="ghost" render={<a href="#how" />} nativeButton={false}>
              How it works ↓
            </Button>
          </div>
        </div>
      </header>

      {/* ============ FEATURES ============ */}
      <section id="features" className="border-b border-[var(--lk-line)] py-[104px] max-[560px]:py-[76px]">
        <div className="mx-auto max-w-[1140px] px-10 max-[920px]:px-6">
          <div className="max-w-[62ch]">
            <Eyebrow>What it watches</Eyebrow>
            <h2 className="mt-[18px] text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
              Everything that takes a server down at 3am.
            </h2>
            <p className="mt-4 text-[1.1rem] text-[var(--lk-ink-2)]">
              Lookout ships with the checks you&apos;d otherwise cobble together
              from scripts and cron jobs — running out of the box, watching the
              things that actually page you.
            </p>
          </div>

          <div className="mt-[54px] grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--lk-line)] bg-[var(--lk-line)] max-[920px]:grid-cols-2 max-[560px]:grid-cols-1">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[var(--lk-surface)] px-7 pt-[30px] pb-[34px]">
                <div className="mb-5 grid size-[38px] place-items-center rounded-[10px] bg-[var(--lk-accent-tint)] text-[var(--lk-accent-strong)]">
                  <HugeiconsIcon icon={f.icon} size={21} strokeWidth={1.8} />
                </div>
                <h3 className="text-[1.18rem] font-semibold tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-[9px] text-[0.97rem] leading-[1.55] text-[var(--lk-ink-2)]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="border-b border-[var(--lk-line)] py-[104px] max-[560px]:py-[76px]">
        <div className="mx-auto max-w-[1140px] px-10 max-[920px]:px-6">
          <div className="max-w-[62ch]">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-[18px] text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
              Up and running in one command.
            </h2>
            <p className="mt-4 text-[1.1rem] text-[var(--lk-ink-2)]">
              No control plane to deploy, no time-series database to feed.
              Install the binary, point it at what matters, and get out of the
              way.
            </p>
          </div>

          <div className="relative mt-[72px] grid grid-cols-3 gap-12 max-[920px]:grid-cols-1 max-[920px]:gap-11">
            <div className="absolute top-7 right-[16.66%] left-[16.66%] z-0 h-0.5 [background-image:linear-gradient(90deg,var(--lk-line)_55%,transparent_0)] [background-size:13px_2px] max-[920px]:hidden" />
            {STEPS.map((s) => (
              <div key={s.num} className="lk-step relative z-10 flex flex-col items-center text-center">
                <div className="lk-badge grid size-14 place-items-center rounded-full border-[1.5px] border-[var(--lk-line)] bg-[var(--lk-surface)] text-[var(--lk-accent-strong)] shadow-[0_0_0_7px_var(--lk-bg),0_10px_24px_-16px_rgba(20,22,26,0.4)] transition-colors duration-200">
                  <HugeiconsIcon
                    icon={s.icon}
                    size={24}
                    strokeWidth={1.7}
                    className={`lk-ic lk-ic-${s.anim}`}
                  />
                </div>
                <span className="mt-6 font-mono text-[11.5px] font-medium tracking-[0.16em] text-[var(--lk-accent-strong)] uppercase">
                  {s.num}
                </span>
                <h3 className="mt-[11px] text-[1.32rem] font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-3 max-w-[30ch] text-[1rem] leading-[1.55] text-[var(--lk-ink-2)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <InstallCommand className="w-[min(560px,100%)]" />
          </div>
        </div>
      </section>

      {/* ============ ALERT CHANNELS ============ */}
      <section id="alerts" className="overflow-hidden border-b border-[var(--lk-line)] py-[104px] max-[560px]:py-[76px]">
        <div className="mx-auto max-w-[1140px] px-10 max-[920px]:px-6">
          <div className="max-w-[62ch]">
            <Eyebrow>Where alerts land</Eyebrow>
            <h2 className="mt-[18px] text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
              Get told where you&apos;ll actually see it.
            </h2>
            <p className="mt-4 text-[1.1rem] text-[var(--lk-ink-2)]">
              Route every alert to the place your team already lives. Mix and
              match as many channels as you like.
            </p>
          </div>

          <div className="lk-marquee mt-[46px] flex flex-col gap-[18px] py-4">
            <div className="lk-mq-row">
              {[...CHANNELS_A, ...CHANNELS_A].map((c, i) => (
                <ChannelPill key={`a-${i}`} {...c} />
              ))}
            </div>
            <div className="lk-mq-row rev">
              {[...CHANNELS_B, ...CHANNELS_B].map((c, i) => (
                <ChannelPill key={`b-${i}`} {...c} />
              ))}
            </div>
          </div>

          <p className="mt-12 text-center text-[1rem] text-[var(--lk-ink-3)]">
            A dozen destinations built in — and anything else you can reach with a{" "}
            <code className="rounded-[5px] bg-[var(--lk-line-2)] px-[7px] py-0.5 font-mono text-[0.85rem] text-[var(--lk-ink-2)]">
              POST
            </code>
            .
          </p>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="border-b border-[var(--lk-line)] bg-[var(--lk-ink)] text-white">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center px-10 py-24 text-center max-[920px]:px-6">
          <LookoutLogo reversed href="#install" className="mb-[26px]" style={{ fontSize: 30 }} />
          <span className="inline-flex items-center gap-2.5 font-mono text-[12.5px] font-medium tracking-[0.12em] text-white/60 uppercase">
            <span className="size-[7px] rounded-full bg-[var(--lk-accent)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--lk-accent),transparent_78%)]" />
            Free &amp; open source
          </span>
          <h2 className="mt-[18px] max-w-[18ch] text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-white">
            Start watching your server in 30 seconds.
          </h2>
          <p className="mt-[18px] max-w-[50ch] text-[1.12rem] text-white/[0.62]">
            One command on the box you want to keep alive. Star it on GitHub if
            it saves your weekend.
          </p>

          <InstallCommand className="mt-9 w-[min(620px,100%)] border-[#262a30] bg-[#0e1013]" />

          <div className="mt-6 flex flex-wrap justify-center gap-3.5">
            <Button render={<a href={GITHUB_URL} />} nativeButton={false}>
              <HugeiconsIcon icon={Github01Icon} size={17} />
              View on GitHub
            </Button>
            <Button
              variant="outline"
              render={<a href={GITHUB_URL} />}
              nativeButton={false}
              className="border-white/20 bg-transparent text-white hover:border-white/35 hover:bg-white/[0.07] hover:text-white dark:border-white/20 dark:bg-transparent dark:hover:bg-white/[0.07]"
            >
              Read the docs
            </Button>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="pt-16 pb-12">
        <div className="mx-auto max-w-[1140px] px-10 max-[920px]:px-6">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 border-b border-[var(--lk-line)] pb-12 max-[920px]:grid-cols-2 max-[920px]:gap-[34px]">
            <div className="max-[920px]:col-span-full">
              <LookoutLogo href="#install" className="mb-4" />
              <p className="max-w-[30ch] text-[0.95rem] text-[var(--lk-ink-2)]">
                Lightweight, open-source monitoring that pings you before things
                break. Built for people who run their own servers.
              </p>
            </div>
            {[
              {
                head: "Product",
                links: [
                  ["Features", "#features"],
                  ["How it works", "#how"],
                  ["Alert channels", "#alerts"],
                ],
              },
              {
                head: "Resources",
                links: [
                  ["Documentation", GITHUB_URL],
                  ["Releases", `${GITHUB_URL}/releases`],
                  ["Issues", `${GITHUB_URL}/issues`],
                ],
              },
              {
                head: "Project",
                links: [
                  ["GitHub", GITHUB_URL],
                  ["MIT License", `${GITHUB_URL}/blob/main/LICENSE`],
                  ["Changelog", GITHUB_URL],
                ],
              },
            ].map((col) => (
              <div key={col.head}>
                <h4 className="mb-4 font-mono text-[11.5px] font-medium tracking-[0.12em] text-[var(--lk-ink-3)] uppercase">
                  {col.head}
                </h4>
                <ul className="flex flex-col gap-[11px]">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-[0.95rem] text-[var(--lk-ink-2)] transition-colors hover:text-[var(--lk-ink)]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3.5 pt-7 font-mono text-[0.88rem] text-[var(--lk-ink-3)]">
            <span>© 2026 Lookout · MIT Licensed</span>
            <span>Built for people who run their own servers.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
