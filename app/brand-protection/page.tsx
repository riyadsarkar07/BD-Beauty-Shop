import type { Metadata } from "next"
import Image from "next/image"
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
    "Learn about Beauty Room's registered trademark and view the original Bangladesh registration certificate.",
  alternates: {
    canonical: "/brand-protection",
  },
  openGraph: {
    title: "Brand Protection | Beauty Room",
    description: "Beauty Room® — registered in Bangladesh, Class 35.",
    url: "/brand-protection",
    images: ["/branding/beauty-room-gold-logo.webp"],
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

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <Image
              src="/branding/beauty-room-gold-logo.webp"
              alt="Beauty Room luxury gold floral logo"
              width={240}
              height={195}
              priority
              className="mb-8 h-auto w-44 rounded-lg border border-[#d9c69e]/50 shadow-sm sm:w-56"
            />

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              Registered in Bangladesh
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Our brand
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              {TRADEMARK.registeredMark}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
              Beauty Room is a beauty and personal-care retail brand.
              Our name is registered for Class 35 retail and wholesale services in Bangladesh.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Territory
                </p>
                <p className="mt-2 font-medium">{TRADEMARK.territory}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Registration class
                </p>
                <p className="mt-2 font-medium">Class {TRADEMARK.classNo}</p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-6 text-muted-foreground">
              The registered symbol refers to Bangladesh Class 35 only;
              no worldwide or additional-class protection is claimed here.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Explore the shop
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/policies"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.13em] transition-colors hover:bg-secondary"
              >
                Store policies
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-border/70 bg-card/50 p-4 shadow-sm sm:p-6">
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                Original registration
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                Trademark certificate
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                View the certificate below. Select the image to open an enlarged, zoomable preview.
              </p>
            </div>
            <CertificateViewer />
          </div>
        </div>

        <details className="group mt-16 border-t border-border/70 pt-8">
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
