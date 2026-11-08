"use server"

import { requireAdmin } from "@/lib/auth-server"
import { db } from "@/lib/db"
import { productImportRuns, products } from "@/lib/db/schema"
import { createProduct } from "@/lib/actions/admin"
import { parseProductCsv } from "@/lib/product-import"

export type ProductImportActionResult = {
  imported: string[]
  failed: { name?: string; reason: string }[]
  duplicates: string[]
  missing: { name?: string; fields: string[] }[]
}

export async function importProductsFromCsv(formData: FormData): Promise<ProductImportActionResult> {
  const session = await requireAdmin()
  const file = formData.get("file")
  const fileName = file instanceof File ? file.name : "upload.csv"

  if (!(file instanceof File) || file.size === 0) {
    return {
      imported: [],
      failed: [{ reason: "Choose a CSV file to import" }],
      duplicates: [],
      missing: [],
    }
  }

  const csvText = await file.text()
  const existing = await db
    .select({
      name: products.name,
      slug: products.slug,
      sku: products.sku,
      brand: products.brand,
    })
    .from(products)

  const existingKeys = new Set<string>()
  for (const product of existing) {
    if (product.slug) existingKeys.add(`slug:${product.slug.toLowerCase()}`)
    if (product.sku) existingKeys.add(`sku:${product.sku.toLowerCase()}`)
    existingKeys.add(`name:${product.name.toLowerCase()}|brand:${(product.brand || "").toLowerCase()}`)
  }

  const parsed = parseProductCsv(csvText, existingKeys)
  const imported: string[] = []
  const failed = [...parsed.failed]

  for (const row of parsed.ready) {
    try {
      await createProduct(row.input)
      imported.push(row.sourceName)
    } catch (error) {
      failed.push({
        name: row.sourceName,
        reason: error instanceof Error ? error.message : "Could not save product",
      })
    }
  }

  const report = {
    imported,
    failed,
    duplicates: parsed.duplicates,
    missing: parsed.missing,
  }

  await db.insert(productImportRuns).values({
    source: "csv",
    fileName,
    status: "completed",
    importedCount: imported.length,
    failedCount: failed.length,
    duplicateCount: parsed.duplicates.length,
    skippedCount: parsed.missing.length,
    report,
    createdBy: session.user.id,
  })

  return report
}
