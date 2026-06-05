"use client"

import { ArrowUpRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"

// Configuration - edit these values
const DESTINATION = "https://www.taskrewards.co/"

function buildDestinationUrl() {
  if (typeof window === "undefined") return DESTINATION

  try {
    const u = new URL(DESTINATION)
    const params = new URLSearchParams(window.location.search)

    params.forEach((value, key) => {
      if (key && key !== "dest" && !u.searchParams.has(key)) {
        u.searchParams.set(key, value)
      }
    })

    return u.toString()
  } catch {
    return DESTINATION
  }
}

function getEscapeUrl(url: string, ua: string) {
  if (/Android/i.test(ua)) {
    const clean = url.replace(/^https?:\/\//, "")
    return (
      "intent://" +
      clean +
      "#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=" +
      encodeURIComponent(url) +
      ";end"
    )
  }

  if (/iPhone|iPad|iPod/i.test(ua)) {
    return url.replace(/^https:\/\//, "x-safari-https://")
  }

  return url
}

function ContinueContent() {
  const [destinationUrl, setDestinationUrl] = useState(DESTINATION)
  const hasRedirected = useRef(false)

  useEffect(() => {
    setDestinationUrl(buildDestinationUrl())
  }, [])

  const handleRedirect = (event: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>) => {
    if (hasRedirected.current || typeof window === "undefined") return

    const normalUrl = buildDestinationUrl()
    const ua = window.navigator.userAgent || ""
    const escapeUrl = getEscapeUrl(normalUrl, ua)

    if (escapeUrl !== normalUrl) {
      hasRedirected.current = true
      event.preventDefault()

      try {
        window.location.href = escapeUrl
      } catch {}

      window.setTimeout(() => {
        try {
          window.location.href = normalUrl
        } catch {
          window.location.assign(normalUrl)
        }
      }, 500)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-5 py-4 bg-black overflow-hidden relative">
      {/* Subtle glow background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(74, 222, 128, 0.18) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[340px] w-full text-center">
        {/* Icon box */}
        <div
          className="w-20 h-20 mx-auto mb-5 rounded-2xl grid place-items-center animate-icon-pulse"
          style={{
            background: "#111111",
            border: "1px solid #1e1e1e",
          }}
          aria-hidden="true"
        >
          <ArrowUpRight className="w-[34px] h-[34px]" style={{ color: "#4ade80" }} strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight mb-2" style={{ color: "#ffffff" }}>
          Open in <span style={{ color: "#4ade80" }}>browser</span>
        </h1>

        {/* Subtext */}
        <p className="text-[14px] leading-relaxed mb-6" style={{ color: "#6b7280" }}>
          For the best experience, this page needs to open in your browser.
        </p>

        {/* CTA Button */}
        <a
          href={destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleRedirect}
          onTouchEnd={handleRedirect}
          role="button"
          className="block w-full text-[14px] font-extrabold text-center py-4 rounded-full uppercase tracking-[2.2px] cursor-pointer mb-4 transition-transform duration-100 active:scale-[0.97] animate-cta-pulse"
          style={{
            background: "#4ade80",
            color: "#000000",
          }}
        >
          Continue
        </a>

        {/* Trust chips */}
        <div className="flex items-center justify-center gap-3 text-[12px] font-medium tracking-wide" style={{ color: "#6b7280" }} aria-hidden="true">
          <span>Safari</span>
          <span className="w-[3px] h-[3px] rounded-full" style={{ background: "#6b7280" }} />
          <span>Chrome</span>
          <span className="w-[3px] h-[3px] rounded-full" style={{ background: "#6b7280" }} />
          <span>Secure</span>
        </div>
      </div>
    </main>
  )
}

export default function ContinuePage() {
  return <ContinueContent />
}
