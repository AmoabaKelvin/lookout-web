"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The Lookout "doodle eyes" wordmark — l👀kout.
 *
 * The pupils idly glance around (CSS animation) until a real cursor moves,
 * then they track the pointer and ease toward it independently, recentering
 * when the pointer leaves the window. This mirrors the behavior from the
 * original design prototype; the eye mark itself is kept as-is.
 */
function LookoutLogo({
  reversed = false,
  className,
  style,
  as: As = "a",
  ...props
}: React.ComponentProps<"a"> & { reversed?: boolean; as?: React.ElementType }) {
  const ref = React.useRef<HTMLAnchorElement>(null)

  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return

    const pupils = Array.from(
      root.querySelectorAll<SVGGElement>(".lk-pupil")
    )
    if (!pupils.length) return

    const MAX = 7 // max pupil travel in SVG units (viewBox is 64)
    let hasMouse = false
    let mx = -1
    let my = -1
    let inside = false
    let raf = 0

    const state = pupils.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }))

    function computeTargets() {
      for (let i = 0; i < pupils.length; i++) {
        const r = pupils[i].getBoundingClientRect()
        if (r.width === 0) {
          state[i].tx = 0
          state[i].ty = 0
          continue
        }
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = mx - cx
        const dy = my - cy
        const d = Math.hypot(dx, dy) || 1
        const mag = inside ? Math.min(MAX, d / 18) : 0
        state[i].tx = (dx / d) * mag
        state[i].ty = (dy / d) * mag
      }
    }

    function tick() {
      for (let i = 0; i < pupils.length; i++) {
        const s = state[i]
        s.x += (s.tx - s.x) * 0.18
        s.y += (s.ty - s.y) * 0.18
        pupils[i].style.transform = `translate(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    function onMove(e: MouseEvent) {
      if (!hasMouse) {
        hasMouse = true
        pupils.forEach((p) => {
          p.style.animation = "none"
        })
        raf = requestAnimationFrame(tick)
      }
      mx = e.clientX
      my = e.clientY
      inside = true
      computeTargets()
    }

    function onOut(e: MouseEvent) {
      if (!e.relatedTarget) {
        inside = false
        computeTargets()
      }
    }
    function onBlur() {
      inside = false
      computeTargets()
    }
    function onScroll() {
      if (hasMouse) computeTargets()
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseout", onOut)
    window.addEventListener("blur", onBlur)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseout", onOut)
      window.removeEventListener("blur", onBlur)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // `reversed` only flips the wordmark text to white for the dark CTA band.
  // The eyes always render as a white eyeball with a dark, cursor-tracking
  // pupil so the pupil stays the dominant, correctly-pointing feature on
  // both light and dark backgrounds.
  return (
    <As
      ref={ref}
      aria-label="lookout home"
      className={cn(
        "inline-flex items-end gap-0 font-semibold leading-none tracking-tight",
        reversed ? "text-white" : "text-[var(--lk-ink)]",
        className
      )}
      style={{ fontSize: 23, ...style }}
      {...props}
    >
      l
      <Eye />
      <Eye />
      kout
    </As>
  )
}

function Eye() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="mx-[0.02em] mb-[-0.04em] h-[0.72em] w-[0.72em] flex-shrink-0"
    >
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="#fff"
        stroke="var(--lk-ink)"
        strokeWidth="6"
      />
      <g className="lk-pupil">
        <circle cx="32" cy="32" r="12" fill="var(--lk-ink)" />
        <circle cx="27" cy="27" r="4" fill="#fff" />
      </g>
    </svg>
  )
}

export { LookoutLogo }
