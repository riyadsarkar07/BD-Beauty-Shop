"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { CONTACT_EMAIL } from "@/lib/constants"
import { TRADEMARK } from "@/lib/trademark"

const MISUSE_TYPES = [
  { value: "impersonation", label: "Impersonation of the registered mark" },
  { value: "similar-name", label: "Confusingly similar name or trading style" },
  { value: "device", label: "Unauthorized use of the registered device" },
  { value: "other", label: "Other Class 35 misuse in Bangladesh" },
] as const

const fieldClassName =
  "w-full h-12 px-4 bg-secondary/30 border border-input rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all duration-300"

const labelClassName = "text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"

type FormState = {
  name: string
  email: string
  url: string
  type: (typeof MISUSE_TYPES)[number]["value"] | ""
  details: string
}

const emptyForm: FormState = {
  name: "",
  email: "",
  url: "",
  type: "",
  details: "",
}

export function BrandMisuseReport() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [drafted, setDrafted] = useState(false)

  const mailtoHref = useMemo(() => {
    const typeLabel = MISUSE_TYPES.find((item) => item.value === form.type)?.label ?? "Not specified"
    const subject = `${TRADEMARK.registeredMark} brand misuse report`
    const body = [
      `Mark: ${TRADEMARK.registeredMark}`,
      `Trademark No.: ${TRADEMARK.number}`,
      `Class: ${TRADEMARK.classNo} (${TRADEMARK.territory})`,
      "",
      `Reporter: ${form.name}`,
      `Email: ${form.email}`,
      `Misuse type: ${typeLabel}`,
      `URL or location: ${form.url || "Not provided"}`,
      "",
      "Details:",
      form.details,
      "",
      "This message was drafted from the Beauty Room Brand Protection page. The website does not keep a copy of this draft.",
    ].join("\n")

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [form])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDrafted(true)
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClassName} htmlFor="misuse-name">
              Your name
            </label>
            <input
              id="misuse-name"
              name="name"
              required
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName} htmlFor="misuse-email">
              Email
            </label>
            <input
              id="misuse-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className={fieldClassName}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClassName} htmlFor="misuse-url">
              URL or location
            </label>
            <input
              id="misuse-url"
              name="url"
              type="url"
              placeholder="https://"
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName} htmlFor="misuse-type">
              Type of misuse
            </label>
            <select
              id="misuse-type"
              name="type"
              required
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  type: event.target.value as FormState["type"],
                }))
              }
              className={fieldClassName}
            >
              <option value="" disabled>
                Select one
              </option>
              {MISUSE_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClassName} htmlFor="misuse-details">
            What happened
          </label>
          <textarea
            id="misuse-details"
            name="details"
            required
            rows={6}
            value={form.details}
            onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
            className="w-full px-4 py-3 bg-secondary/30 border border-input rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all duration-300"
          />
        </div>
        <Button
          type="submit"
          className="h-13 rounded-none px-7 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          Prepare report draft
        </Button>
      </form>

      {drafted ? (
        <div className="space-y-3 border border-border/60 bg-secondary/10 p-5">
          <p className="text-sm leading-6 text-foreground">
            This form does not send or store a report. There is no backend for brand-misuse filings yet.
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Email the details to {CONTACT_EMAIL} if you want Beauty Room to review them. No automatic legal
            correspondence is generated from this page.
          </p>
          <Button asChild variant="outline" className="h-12 rounded-none px-6 text-xs font-semibold uppercase tracking-[0.2em]">
            <a href={mailtoHref}>Open email draft</a>
          </Button>
        </div>
      ) : (
        <p className="text-xs leading-6 text-muted-foreground">
          Preparing a draft does not file a complaint, store your details, or send a legal threat.
        </p>
      )}
    </div>
  )
}
