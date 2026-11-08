import type { Metadata } from "next"
import { ShopClient } from "@/components/features/shop-client"
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/structured-data"
import { getCatalogProducts } from "@/lib/product-catalog"
import { normalizeSiteUrl } from "@/lib/seo"

export const metadata: Metadata = {
    title: "Accessories",
    description:
        "Shop beauty accessories at BD Beauty, including pouches, mirrors, and finishing extras.",
    alternates: {
        canonical: "/shop/accessories",
    },
    openGraph: {
        title: "Accessories | BD Beauty",
        description:
            "Shop beauty accessories at BD Beauty, including pouches, mirrors, and finishing extras.",
        url: "/shop/accessories",
    },
}

export default function AccessoriesPage() {
    const baseUrl = normalizeSiteUrl()
    const catalogPromise = getCatalogProducts({
        category: "accessory",
        limit: 24,
        offset: 0,
        includeTotal: true,
    })

    return (
        <>
            <JsonLd
                data={breadcrumbJsonLd(baseUrl, [
                    { name: "Home", url: "/" },
                    { name: "Shop", url: "/shop" },
                    { name: "Accessories", url: "/shop/accessories" },
                ])}
            />
            <ShopClient
                genderFilter="all"
                fixedCategory="accessory"
                title="Accessories"
                subtitle="Pouches, mirrors, and finishing extras for a tidy beauty routine."
                initialCatalogPromise={catalogPromise}
            />
            <section className="border-t border-border/60 px-6 py-12 md:px-12 md:py-16">
                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Accessories</p>
                    <p className="text-base leading-8 text-muted-foreground">
                        BD Beauty accessories are selected as finishing pieces rather than filler: pouches, mirrors, and compact essentials that support a beauty routine without cluttering it.
                    </p>
                </div>
            </section>
        </>
    )
}
