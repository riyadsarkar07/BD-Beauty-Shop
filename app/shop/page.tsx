import type { Metadata } from "next"
import { ShopClient } from "@/components/features/shop-client"
import { getCatalogProducts } from "@/lib/product-catalog"
import {
    JsonLd,
    breadcrumbJsonLd,
    collectionJsonLd,
} from "@/components/seo/structured-data"
import { normalizeSiteUrl } from "@/lib/seo"

export const metadata: Metadata = {
    title: "Shop All Beauty",
    description:
        "Explore skincare, makeup, haircare, fragrance, and wellness at BD Beauty Shop. Cash on Delivery nationwide. Free shipping above ৳2,000.",
    alternates: {
        canonical: "/shop",
    },
    openGraph: {
        title: "Shop All Beauty | BD Beauty Shop",
        description:
            "Explore skincare, makeup, haircare, fragrance, and wellness at BD Beauty Shop. Cash on Delivery nationwide.",
        url: "/shop",
    },
}

export default async function ShopPage() {
    const catalog = await getCatalogProducts({
        limit: 24,
        offset: 0,
        includeTotal: true,
    })
    const baseUrl = normalizeSiteUrl()

    return (
        <>
            <JsonLd
                data={breadcrumbJsonLd(baseUrl, [
                    { name: "Home", url: "/" },
                    { name: "Shop", url: "/shop" },
                ])}
            />
            <JsonLd
                data={collectionJsonLd(baseUrl, {
                    name: "Shop All Beauty",
                    description:
                        "Skincare, makeup, haircare, fragrance, bodycare, nailcare, tools, kits, and wellness from BD Beauty Shop.",
                    url: "/shop",
                    products: catalog.products.map((product) => ({
                        name: product.name,
                        slug: product.slug,
                        image: product.images[0] ?? null,
                        sellingPrice: product.sellingPrice,
                    })),
                })}
            />
            <ShopClient
                genderFilter="all"
                title="All Products"
                subtitle="Skincare, makeup, haircare, fragrance, bodycare, and beauty tools delivered across Bangladesh."
                initialCatalog={catalog}
            />
            <section className="border-t border-border/60 px-6 py-12 md:px-12 md:py-16">
                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Beauty index</p>
                    <p className="text-base leading-8 text-muted-foreground">
                        BD Beauty brings together skincare, makeup, haircare, fragrance, bodycare, nailcare, tools, kits, and wellness in one focused catalog. Every listing shows the details supplied by the brand, with prices in Bangladeshi Taka and server-verified totals at checkout.
                    </p>
                </div>
            </section>
        </>
    )
}
