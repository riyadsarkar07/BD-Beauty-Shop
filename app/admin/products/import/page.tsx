"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { importProductsFromCsv, type ProductImportActionResult } from "@/lib/actions/product-import"

export default function ProductImportPage() {
  const [isPending, startTransition] = useTransition()
  const [fileName, setFileName] = useState("")
  const [report, setReport] = useState<ProductImportActionResult | null>(null)
  const [error, setError] = useState("")

  const onSubmit = (formData: FormData) => {
    setError("")
    startTransition(async () => {
      try {
        const result = await importProductsFromCsv(formData)
        setReport(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Import failed")
      }
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Catalog</p>
        <h1 className="font-display text-4xl">CSV import</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Import products from a CSV. Missing prices, SKUs, or specs are not invented. Facebook catalog import is not available.
        </p>
      </div>

      <form action={onSubmit} className="space-y-4 border border-border/60 p-6">
        <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          CSV file
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="mt-2 block w-full text-sm"
            onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
          />
        </label>
        {fileName ? <p className="text-xs text-muted-foreground">{fileName}</p> : null}
        <p className="text-xs text-muted-foreground">
          Columns: name, slug, sku, brand, category, gender, mrp, sellingPrice, stock, description, images, shade, size, tags
        </p>
        <Button type="submit" className="rounded-none" disabled={isPending}>
          {isPending ? "Importing..." : "Import products"}
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {report ? (
        <div className="space-y-6 border border-border/60 p-6 text-sm">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Import report</h2>
          <p>
            Imported {report.imported.length} · Failed {report.failed.length} · Duplicates {report.duplicates.length} · Missing {report.missing.length}
          </p>
          {report.imported.length > 0 ? (
            <section>
              <h3 className="font-medium">Imported</h3>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                {report.imported.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {report.duplicates.length > 0 ? (
            <section>
              <h3 className="font-medium">Duplicates skipped</h3>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                {report.duplicates.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {report.missing.length > 0 ? (
            <section>
              <h3 className="font-medium">Missing information</h3>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                {report.missing.map((item) => (
                  <li key={`${item.name}-${item.fields.join("-")}`}>
                    {item.name || "Unnamed"}: {item.fields.join(", ")}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {report.failed.length > 0 ? (
            <section>
              <h3 className="font-medium">Failed</h3>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                {report.failed.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    {item.name ? `${item.name}: ` : ""}
                    {item.reason}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
