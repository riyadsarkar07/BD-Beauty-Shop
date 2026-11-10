import type { Metadata } from "next"
import { ShopClient } from "@/components/features/shop-client"
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/structured-data"
import { getCatalogProducts } from "@/lib/product-catalog"
import { normalizeSiteUrl } from "@/lib/seo"

export const metadata: Metadata = {
    title: "Premium Collection — Elevated Beauty Picks",
    description:
        "Shop the Beauty Room Premium collection — elevated beauty picks selected for standout formulas and finish.",
    alternates: {
        canonical: "/collections/premium",
    },
    openGraph: {
        title: "Premium Collection | Beauty Room",
        description:
            "Elevated beauty picks selected for standout formulas and finish.",
        url: "/collections/premium",
    },
}

export default function PremiumPage() {
    const baseUrl = normalizeSiteUrl()
    const catalogPromise = getCatalogProducts({
        isPremium: true,
        limit: 24,
        offset: 0,
        includeTotal: true,
    })

    return (
        <>
            <JsonLd
                data={breadcrumbJsonLd(baseUrl, [
                    { name: "Home", url: "/" },
                    { name: "Collections", url: "/" },
                    { name: "Premium", url: "/collections/premium" },
                ])}
            />
            <ShopClient
                genderFilter="all"
                title="Premium"
                subtitle="Elevated formulas. Considered finish. Standout presence."
                isPremium
                initialCatalogPromise={catalogPromise}
            />
            <section className="border-t border-border/60 px-6 py-12 md:px-12 md:py-16">
                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Premium edit</p>
                    <p className="text-base leading-8 text-muted-foreground">
                        The Beauty Room Premium collection highlights beauty products selected for richer formulas, cleaner finish, and a more considered routine. It is a focused edit for shoppers who want the brand&apos;s standout picks first.
                    </p>
                </div>
            </section>
        </>
    )
}
