import { CopyButton } from "@/components/copy-button"

// The Lookout agent reads heartbeat config from YAML at /etc/lookout/config.yaml
// under `heartbeat: { url, interval }`. This snippet must match that exactly or
// copy-paste setup breaks.
export function SetupInstructions({
  pingUrl,
  intervalSeconds,
}: {
  pingUrl: string
  intervalSeconds: number
}) {
  const config = `# /etc/lookout/config.yaml\nheartbeat:\n  url: "${pingUrl}"\n  interval: ${intervalSeconds}s`
  const restart = "sudo systemctl restart lookout"

  return (
    <div className="space-y-5">
      <Step
        n={1}
        title="Add the heartbeat to your Lookout config"
        copyValue={config}
        code={config}
      />
      <Step n={2} title="Restart Lookout" copyValue={restart} code={restart} />
    </div>
  )
}

function Step({
  n,
  title,
  code,
  copyValue,
}: {
  n: number
  title: string
  code: string
  copyValue: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--lk-ink-2)]">
          <span className="mr-2 font-mono text-xs text-[var(--lk-ink-3)]">
            {n}
          </span>
          {title}
        </span>
        <CopyButton value={copyValue} />
      </div>
      <pre className="overflow-x-auto rounded-xl border border-[#23262b] bg-[#0e1013] p-4 font-mono text-[13px] leading-relaxed text-[#cfcdc8]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
