import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/AmoabaKelvin/lookout/main/install.sh | sudo sh"

/** Dark command chip: `$ curl … | sudo sh` with a copy button. */
function InstallCommand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-xl border border-[#23262b] bg-[var(--lk-ink)] py-[15px] pr-[15px] pl-5 font-mono shadow-[0_18px_40px_-22px_rgba(20,22,26,0.55)]",
        className
      )}
    >
      <span className="font-bold text-[var(--lk-accent)] select-none">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto text-[14.5px] whitespace-nowrap text-[#edebe6] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {INSTALL_CMD}
      </code>
      <CopyButton value={INSTALL_CMD} />
    </div>
  )
}

export { InstallCommand, INSTALL_CMD }
