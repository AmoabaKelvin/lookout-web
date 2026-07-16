import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/AmoabaKelvin/lookout/main/install.sh | sudo sh"

/** Dark command chip: `$ curl … | sudo sh` with a copy button. */
function InstallCommand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[10px] border border-[#26292e] bg-[#101214] py-3 pr-3 pl-4 font-mono",
        className
      )}
    >
      <span className="font-bold text-[var(--lk-accent)] select-none">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto text-[13.5px] whitespace-nowrap text-[#e6e4df] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {INSTALL_CMD}
      </code>
      <CopyButton value={INSTALL_CMD} />
    </div>
  )
}

export { InstallCommand, INSTALL_CMD }
