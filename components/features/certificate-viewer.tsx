"use client"

import { useCallback, useId, useState } from "react"
import Image from "next/image"
import { useReducedMotion } from "framer-motion"
import { TRADEMARK } from "@/lib/trademark"

const MIN_ZOOM = 1
const MAX_ZOOM = 2.4
const ZOOM_STEP = 0.2

export function CertificateViewer() {
  const dialogId = useId()
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const shouldReduceMotion = useReducedMotion()

  const close = useCallback(() => {
    setOpen(false)
    setZoom(1)
  }, [])

  const zoomIn = useCallback(() => {
    setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(1))))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(1))))
  }, [])

  return (
    <>
      <figure className="space-y-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden border border-border/60 bg-secondary/20 text-left"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Image
            src={TRADEMARK.certificatePreviewSrc}
            alt={TRADEMARK.certificatePreviewAlt}
            width={TRADEMARK.certificateWidth}
            height={TRADEMARK.certificateHeight}
            className="h-auto w-full object-contain"
            unoptimized
            draggable={false}
          />
          <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-background">
            Open preview
          </span>
        </button>
        <figcaption className="text-xs leading-6 text-muted-foreground">
          On-page preview of Trademark No. {TRADEMARK.number}. The image is shown for inspection only and is
          not offered as a public copy of the certificate.
        </figcaption>
      </figure>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogId}
          className="fixed inset-0 z-50 flex flex-col bg-background/95"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-4 md:px-8">
            <p id={dialogId} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Certificate preview
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={zoomOut}
                className="h-10 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] border border-border/70"
                aria-label="Zoom out"
              >
                Zoom out
              </button>
              <button
                type="button"
                onClick={zoomIn}
                className="h-10 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] border border-border/70"
                aria-label="Zoom in"
              >
                Zoom in
              </button>
              <button
                type="button"
                onClick={close}
                className="h-10 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] border border-border/70"
              >
                Close
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4 md:p-8">
            <div className="mx-auto max-w-5xl">
              <Image
                src={TRADEMARK.certificatePreviewSrc}
                alt={TRADEMARK.certificatePreviewAlt}
                width={TRADEMARK.certificateWidth}
                height={TRADEMARK.certificateHeight}
                className="h-auto w-full origin-top object-contain"
                unoptimized
                draggable={false}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                  transition: shouldReduceMotion ? "none" : "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
