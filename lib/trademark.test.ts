import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { test } from "node:test"

import { TRADEMARK, TRADEMARK_FACTS, TRADEMARK_NOTICE_LONG } from "./trademark.ts"

function read(path: string) {
  return readFileSync(path, "utf8")
}

test("trademark source data matches the printed Bangladesh Class 35 certificate", () => {
  assert.equal(TRADEMARK.mark, "Beauty Room")
  assert.equal(TRADEMARK.registeredMark, "Beauty Room®")
  assert.equal(TRADEMARK.number, "193453")
  assert.equal(TRADEMARK.applicationSerialNo, "193453")
  assert.equal(TRADEMARK.classNo, "35")
  assert.equal(TRADEMARK.territory, "Bangladesh")
  assert.equal(TRADEMARK.journalNo, "335")
  assert.equal(TRADEMARK.applicationDate, "2024-12-08")
  assert.equal(TRADEMARK.certificateDate, "2025-12-04")
  assert.equal(TRADEMARK.proprietorName, "Riyad Sarkar")
  assert.equal(TRADEMARK.proprietorRole, "Proprietor")
  assert.equal(TRADEMARK.proprietorAddress, "ZN Tower, 2nd Floor, Plot 2, Road 8, Gulshan 2, Dhaka-1212")
  assert.match(TRADEMARK.proprietorAddress, /Gulshan 2, Dhaka-1212/)
  assert.equal(
    TRADEMARK.goodsAndServices,
    "online retail and wholesale services featuring cosmetics, skincare, makeup, beauty and personal care products",
  )
  assert.equal(
    TRADEMARK.certificateProceedingLimit,
    "This certificate is not for use in legal proceeding or for obtaining registration abroad.",
  )
  assert.equal(TRADEMARK.symbolScope, "Bangladesh Class 35")
  assert.equal(TRADEMARK.certificatePreviewSrc, "/brand-protection/certificate-tm-193453.webp")
  assert.equal(TRADEMARK_FACTS.length, 12)
  assert.match(TRADEMARK_NOTICE_LONG, /Class 35/)
})

test("trademark source data does not invent extra ownership or territory claims", () => {
  const source = `${JSON.stringify(TRADEMARK)}\n${TRADEMARK_NOTICE_LONG}`

  assert.doesNotMatch(source, /Unilever/i)
  assert.doesNotMatch(source, /worldwide|global registration|every class|all classes/i)
  assert.doesNotMatch(source, /legal threat/i)
  assert.equal(TRADEMARK.symbolScope.includes("Bangladesh"), true)
  assert.equal(TRADEMARK.symbolScope.includes("35"), true)
})

test("certificate preview asset is present and the page does not offer a download", () => {
  assert.equal(existsSync("public/brand-protection/certificate-tm-193453.webp"), true)

  const page = read("app/brand-protection/page.tsx")
  const viewer = read("components/features/certificate-viewer.tsx")
  const form = read("components/features/brand-misuse-report.tsx")
  const config = read("next.config.ts")

  assert.match(page, /<CertificateViewer \/>/)
  assert.match(page, /certificateProceedingLimit/)
  assert.match(page, /TRADEMARK\.proprietorName/)
  assert.match(viewer, /TRADEMARK\.certificatePreviewSrc/)
  assert.doesNotMatch(page, /download/i)
  assert.doesNotMatch(viewer, /download/i)
  assert.doesNotMatch(page, /Unilever/i)
  assert.match(page, /does not claim worldwide rights/)
  assert.doesNotMatch(form, /fetch\(|\/api\/|submitted successfully/i)
  assert.match(form, /does not send or store/)
  assert.match(config, /Content-Disposition/)
  assert.match(config, /inline/)
})

test("brand protection is linked from sitemap, footer, about, policies, and llms.txt", () => {
  const sitemap = read("app/sitemap.ts")
  const footer = read("components/layout/footer.tsx")
  const about = read("app/about/page.tsx")
  const policies = read("app/policies/page.tsx")
  const llms = read("app/llms.txt/route.ts")
  const navbar = read("app/navbar.tsx")

  assert.match(sitemap, /\/brand-protection/)
  assert.match(footer, /\/brand-protection/)
  assert.match(footer, /TRADEMARK\.noticeShort/)
  assert.match(about, /\/brand-protection/)
  assert.match(about, /TRADEMARK\.registeredMark|TRADEMARK_NOTICE_LONG/)
  assert.match(policies, /\/brand-protection/)
  assert.match(llms, /\/brand-protection/)
  assert.match(navbar, /href: "\/brand-protection", label: "Brand Protection"/)
})
