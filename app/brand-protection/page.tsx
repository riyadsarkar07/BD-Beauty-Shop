import type { Metadata } from "next"
import Link from "next/link"
import { BrandMisuseReport } from "@/components/features/brand-misuse-report"
import { CertificateViewer } from "@/components/features/certificate-viewer"
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/structured-data"
import { CONTACT_EMAIL } from "@/lib/constants"
import { normalizeSiteUrl } from "@/lib/seo"
import { TRADEMARK, TRADEMARK_FACTS, TRADEMARK_NOTICE_LONG } from "@/lib/trademark"

export const metadata: Metadata = {
  title: "Trademark & Brand Protection",
  description:
    "Beauty Room® is a registered trademark in Bangladesh in Class 35. Review the certificate facts, scope of protection, and how to report suspected misuse.",
  alternates: {
    canonical: "/brand-protection",
  },
  openGraph: {
    title: "Trademark & Brand Protection | Beauty Room",
    description:
      "Beauty Room® is a registered trademark in Bangladesh in Class 35 for online retail and wholesale services featuring cosmetics, skincare, makeup, beauty and personal care products.",
    url: "/brand-protection",
  },
}

const faqs = [
  {
    question: "Is Beauty Room a registered trademark?",
    answer:
      "Yes. Beauty Room is registered in Bangladesh in Class 35 under Trademark No. 193453 for online retail and wholesale services featuring cosmetics, skincare, makeup, beauty and personal care products.",
  },
  {
    question: "Who is named as proprietor on the certificate?",
    answer:
      "The printed certificate names Riyad Sarkar as proprietor, with the address ZN Tower, 2nd Floor, Plot 2, Road 8, Gulshan 2, Dhaka-1212.",
  },
  {
    question: "Does the ® symbol mean worldwide protection?",
    answer:
      "No. The ® symbol on this site refers only to the Bangladesh Class 35 registration shown on Trademark No. 193453. This page does not claim worldwide rights or extra classes.",
  },
  {
    question: "Can this certificate be used in legal proceedings?",
    answer:
      "The certificate states that it is not for use in legal proceeding or for obtaining registration abroad. The on-page image is a preview only.",
  },
]

export default function BrandProtectionPage() {
  const baseUrl = normalizeSiteUrl()

  return (
    <div className="min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd(baseUrl, [
          { name: "Home", url: "/" },
          { name: "Brand Protection", url: "/brand-protection" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <div className="border-b border-border/60 px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Legal
        </p>
        <h1 className="font-display text-4xl md:text-6xl">Trademark & brand protection</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          {TRADEMARK_NOTICE_LONG} The facts below are taken from the printed Bangladesh certificate. This page
          does not claim worldwide rights, extra classes, or any proprietor other than the name printed on the
          certificate.
        </p>
      </div>

      <div className="space-y-16 px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Registration facts
            </p>
            <h2 className="font-display mt-4 text-3xl md:text-5xl">{TRADEMARK.registeredMark}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Certificate of Registration of Trademark issued by the {TRADEMARK.issuingAuthority},{" "}
              {TRADEMARK.issuingGovernment}.
            </p>
            <dl className="mt-8 divide-y divide-border/60 border-y border-border/60">
              {TRADEMARK_FACTS.map((fact) => (
                <div key={fact.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="text-sm leading-6 text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <CertificateViewer />
        </section>

        <section className="mx-auto max-w-6xl space-y-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Scope
          </p>
          <h2 className="font-display text-3xl md:text-5xl">What this registration covers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="border border-border/60 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em]">Covered</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Bangladesh Class {TRADEMARK.classNo}: {TRADEMARK.goodsAndServices}. The ® symbol on this site
                refers only to that registered mark in that class and territory.
              </p>
            </article>
            <article className="border border-border/60 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em]">Not claimed here</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                This page does not claim worldwide protection, other Nice classes, product-brand ownership of
                every item sold in the shop, or any proprietor other than {TRADEMARK.proprietorName}.
              </p>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Certificate limits
          </p>
          <h2 className="font-display text-3xl md:text-5xl">Printed limits on the certificate</h2>
          <div className="space-y-4 border border-border/60 p-6">
            <p className="text-sm leading-7 text-foreground">{TRADEMARK.registrationTerm}</p>
            <p className="text-sm leading-7 text-foreground">{TRADEMARK.certificateProceedingLimit}</p>
            <p className="text-sm leading-7 text-muted-foreground">{TRADEMARK.ownershipChangeNote}</p>
            <p className="text-sm leading-7 text-muted-foreground">
              The on-page image is a preview. Beauty Room does not offer a public copy of the certificate.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Misuse
          </p>
          <h2 className="font-display text-3xl md:text-5xl">Unauthorized use</h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            Using {TRADEMARK.registeredMark}, a confusingly similar trading name, or the registered device to
            present an unauthorized Bangladesh Class {TRADEMARK.classNo} retail or wholesale beauty service may
            be misuse of the registered mark. This page does not send legal threats and does not start a legal
            proceeding.
          </p>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            If you need to contact the store about suspected misuse, email {CONTACT_EMAIL}. Store policies remain
            at{" "}
            <Link href="/policies" className="text-foreground underline underline-offset-4">
              /policies
            </Link>
            .
          </p>
        </section>

        <section className="mx-auto max-w-6xl space-y-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Report
          </p>
          <h2 className="font-display text-3xl md:text-5xl">Report brand misuse</h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            This form is frontend-only. It does not send or store a report. Use it to collect details and, if
            you choose, open an email draft to {CONTACT_EMAIL}.
          </p>
          <BrandMisuseReport />
        </section>
      </div>
    </div>
  )
}
