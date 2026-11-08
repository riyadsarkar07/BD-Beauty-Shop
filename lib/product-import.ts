import { isProductCategory, type ProductCategory } from "./product-categories.ts"
import type { ProductInput } from "./admin-product-input.ts"

export type ProductImportRow = {
  name?: string
  slug?: string
  sku?: string
  brand?: string
  category?: string
  gender?: string
  mrp?: string
  sellingPrice?: string
  stock?: string
  description?: string
  images?: string
  shade?: string
  size?: string
  tags?: string
}

export type ProductImportFailure = {
  name?: string
  reason: string
}

export type ProductImportMissing = {
  name?: string
  fields: string[]
}

export type ParsedProductImport = {
  input: ProductInput
  sku?: string
  brand?: string
  sourceName: string
}

export type ProductImportParseResult = {
  ready: ParsedProductImport[]
  failed: ProductImportFailure[]
  duplicates: string[]
  missing: ProductImportMissing[]
}

const HEADER_ALIASES: Record<string, keyof ProductImportRow> = {
  name: "name",
  slug: "slug",
  sku: "sku",
  brand: "brand",
  category: "category",
  gender: "gender",
  mrp: "mrp",
  sellingprice: "sellingPrice",
  selling_price: "sellingPrice",
  stock: "stock",
  description: "description",
  images: "images",
  shade: "shade",
  size: "size",
  tags: "tags",
}

function splitCsvLine(line: string) {
  const cells: string[] = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"' && inQuotes && next === '"') {
      current += '"'
      index += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  cells.push(current.trim())
  return cells
}

function parseCsv(text: string) {
  return text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitCsvLine)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function normalizeCategory(value?: string): ProductCategory | null {
  if (!value) return null
  const compact = value.trim().toLowerCase()
  if (compact === "accessories") return "accessory"
  return isProductCategory(compact) ? compact : null
}

function normalizeGender(value?: string): ProductInput["gender"] {
  const compact = value?.trim().toLowerCase()
  if (compact === "men" || compact === "women" || compact === "unisex") return compact
  return "unisex"
}

function parseAmount(value?: string) {
  if (!value?.trim()) return null
  const amount = Number(value.replace(/[^\d.]/g, ""))
  if (!Number.isFinite(amount) || amount < 0) return null
  return String(amount)
}

function parseImages(value?: string) {
  if (!value?.trim()) return []
  return value
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseTags(value?: string) {
  if (!value?.trim()) return []
  return value
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function duplicateKey(row: { slug: string; sku?: string; name: string; brand?: string }) {
  if (row.sku) return `sku:${row.sku.toLowerCase()}`
  if (row.slug) return `slug:${row.slug.toLowerCase()}`
  return `name:${row.name.toLowerCase()}|brand:${(row.brand || "").toLowerCase()}`
}

export function parseProductCsv(csvText: string, existingKeys: Set<string> = new Set()): ProductImportParseResult {
  const table = parseCsv(csvText)
  const ready: ParsedProductImport[] = []
  const failed: ProductImportFailure[] = []
  const duplicates: string[] = []
  const missing: ProductImportMissing[] = []

  if (table.length === 0) {
    return { ready, failed: [{ reason: "CSV is empty" }], duplicates, missing }
  }

  const headers = table[0].map((header) => HEADER_ALIASES[header.toLowerCase().replace(/\s+/g, "")])
  if (!headers.includes("name")) {
    return { ready, failed: [{ reason: "CSV must include a name column" }], duplicates, missing }
  }

  const seen = new Set(existingKeys)

  for (const cells of table.slice(1)) {
    const row: ProductImportRow = {}
    headers.forEach((header, index) => {
      if (!header) return
      row[header] = cells[index]?.trim() || ""
    })

    const name = row.name?.trim()
    if (!name) {
      failed.push({ reason: "Missing product name" })
      continue
    }

    const missingFields: string[] = []
    const category = normalizeCategory(row.category)
    const mrp = parseAmount(row.mrp)
    const sellingPrice = parseAmount(row.sellingPrice)

    if (!category) missingFields.push("category")
    if (!mrp) missingFields.push("mrp")
    if (!sellingPrice) missingFields.push("sellingPrice")

    if (missingFields.length > 0) {
      missing.push({ name, fields: missingFields })
      failed.push({
        name,
        reason: `Missing required fields: ${missingFields.join(", ")}. Prices and specs were not invented.`,
      })
      continue
    }

    const slug = slugify(row.slug?.trim() || name)
    const sku = row.sku?.trim() || undefined
    const brand = row.brand?.trim() || undefined
    const key = duplicateKey({ slug, sku, name, brand })

    if (seen.has(key) || seen.has(`slug:${slug}`) || (sku && seen.has(`sku:${sku.toLowerCase()}`))) {
      duplicates.push(name)
      continue
    }

    seen.add(key)
    seen.add(`slug:${slug}`)
    if (sku) seen.add(`sku:${sku.toLowerCase()}`)

    const shade = row.shade?.trim()
    const size = row.size?.trim() || "One Size"
    const colors = shade ? [{ name: shade, hex: "#000000" }] : []

    ready.push({
      sourceName: name,
      sku,
      brand,
      input: {
        name,
        slug,
        description: row.description?.trim() || null,
        mrp: mrp!,
        sellingPrice: sellingPrice!,
        category: category!,
        gender: normalizeGender(row.gender),
        brand: brand || null,
        sku: sku || null,
        stock: Number.parseInt(row.stock || "0", 10) || 0,
        images: parseImages(row.images),
        tags: parseTags(row.tags),
        sizes: [size],
        colors,
        variants: [{ size, color: shade || null, stock: Number.parseInt(row.stock || "0", 10) || 0 }],
        isActive: true,
      },
    })
  }

  return { ready, failed, duplicates, missing }
}
