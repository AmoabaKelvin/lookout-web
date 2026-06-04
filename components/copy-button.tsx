"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  function onCopy() {
    navigator.clipboard?.writeText(value.trim())
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      type="button"
      size="icon"
      onClick={onCopy}
      aria-label="Copy install command"
      className={cn(
        "shrink-0 border border-[#32363c] bg-[#23262b] text-[#cfcdc8] hover:bg-[#2c3036] hover:text-white",
        copied &&
          "border-transparent bg-[var(--lk-accent)] text-[var(--lk-accent-ink)] hover:bg-[var(--lk-accent)] hover:text-[var(--lk-accent-ink)]",
        className
      )}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} strokeWidth={2} />
    </Button>
  )
}

export { CopyButton }
