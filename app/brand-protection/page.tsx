import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, ShieldCheck } from "lucide-react"
import { BrandMisuseReport } from "@/components/features/brand-misuse-report"
import { CertificateViewer } from "@/components/features/certificate-viewer"
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/structured-data"
import { normalizeSiteUrl } from "@/lib/seo"
import { TRADEMARK } from "@/lib/trademark"

export const metadata: Metadata = {
  title: "Brand Protection | Beauty Room",
  description:
    "Learn about Beauty Room's registered trademark and brand protection in Bangladesh.",
  alternates: {
    canonical: "/brand-protection",
  },
  openGraph: {
    title: "Brand Protection | Beauty Room",
    description: "Beauty Room® — registered in Bangladesh, Class 35.",
    url: "/brand-protection",
  },
}

export default function BrandProtectionPage() {
  const baseUrl = normalizeSiteUrl()

  return (
    <main className="min-h-[75svh] bg-background text-foreground">
      <JsonLd
        data={breadcrumbJsonLd(baseUrl, [
          { name: "Home", url: "/" },
          { name: "Brand Protection", url: "/brand-protection" },
        ])}
      />

      <section className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
        <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          Registered in Bangladesh
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Our brand
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          {TRADEMARK.registeredMark}
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
          Beauty Room is a beauty and personal-care retail brand. Our name is a
          registered trademark for Class 35 retail and wholesale services in Bangladesh.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-card px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Territory
            </p>
            <p className="mt-2 text-lg font-medium">{TRADEMARK.territory}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Registration class
            </p>
            <p className="mt-2 text-lg font-medium">Class {TRADEMARK.classNo}</p>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-xs leading-6 text-muted-foreground">
          The registered symbol refers to the Bangladesh Class 35 registration only;
          no worldwide or additional-class protection is claimed here.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Explore the shop
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-xs font-semibold uppercase tracking-[0.13em] transition-colors hover:bg-secondary"
          >
            Store policies
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <section aria-labelledby="trademark-certificate-title" className="mt-16 border-t border-border/70 pt-8">
          <h2 id="trademark-certificate-title" className="font-display text-3xl md:text-4xl">
            Trademark certificate
          </h2>
          <p className="mt-3 mb-6 max-w-xl text-sm leading-7 text-muted-foreground">
            Original registration certificate. Select the preview to view it larger.
          </p>
          <div className="max-w-sm">
            <CertificateViewer />
          </div>
        </section>

        <details className="group mt-8 border-t border-border/70 pt-8">
          <summary className="cursor-pointer list-item text-sm font-medium text-foreground marker:text-muted-foreground">
            Report suspected brand misuse
          </summary>
          <div className="mt-6 max-w-3xl space-y-5">
            <p className="text-sm leading-7 text-muted-foreground">
              This optional form creates an email draft only. It does not submit or store a report.
            </p>
            <BrandMisuseReport />
          </div>
        </details>
      </section>
    </main>
  )
}
