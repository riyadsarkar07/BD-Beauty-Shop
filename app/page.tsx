import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/features/hero";
import { ComboSection } from "@/components/features/combo-section";
import { Dec2024GalleryBand } from "@/components/features/dec2024-gallery-band";
import { ProductGrid } from "@/components/features/product-grid";
import { RealReviews } from "@/components/features/real-reviews";
import { DirectionalMarquee } from "@/components/effects/directional-marquee";
import { getActiveCombosWithProducts } from "@/lib/combos";
import { getCatalogProducts } from "@/lib/product-catalog";
import { WINTER_CATEGORIES } from "@/lib/product-categories";
import { planHomepageMerchandising } from "@/lib/homepage-merchandising";
import {
  JsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/components/seo/structured-data";
import { normalizeSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home | Beauty, delivered across Bangladesh",
  description:
    "Shop skincare, makeup, haircare, fragrance, and wellness at Beauty Room. Cash on Delivery nationwide. Free shipping above ৳2,000.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Beauty Room | Beauty, delivered across Bangladesh",
    description:
      "Shop skincare, makeup, haircare, fragrance, and wellness at Beauty Room. Cash on Delivery nationwide. Free shipping above ৳2,000.",
    url: "/",
  },
};

function HomeSectionsFallback() {
  return (
    <div aria-hidden="true">
      <section className="bg-background px-6 py-16 md:px-12 md:py-24">
        <div className="flex flex-col items-center mb-10 md:mb-14">
          <div className="h-12 w-56 animate-pulse bg-muted md:h-16 md:w-72" />
          <div className="mt-8 flex items-center gap-8">
            <div className="h-4 w-20 animate-pulse bg-muted" />
            <div className="h-4 w-20 animate-pulse bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-3">
              <div className="aspect-[3/4] animate-pulse bg-muted" />
              <div className="space-y-2 px-1">
                <div className="h-3 w-3/4 animate-pulse bg-muted" />
                <div className="h-3 w-1/2 animate-pulse bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-background px-6 py-16 md:px-12 md:py-24">
        <div className="mb-8 flex flex-col items-center md:mb-12">
          <div className="h-3 w-28 animate-pulse bg-muted" />
          <div className="mt-4 h-12 w-44 animate-pulse bg-muted md:h-16 md:w-56" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[0, 1].map((item) => (
            <div key={item} className="border border-border/60 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-[3/4] animate-pulse bg-muted" />
                <div className="aspect-[3/4] animate-pulse bg-muted" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-2/3 animate-pulse bg-muted" />
                <div className="h-3 w-1/2 animate-pulse bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

async function HomeMerchandisingSections() {
  const [{ products }, combos] = await Promise.all([
    getCatalogProducts(),
    getActiveCombosWithProducts(4),
  ]);
  const merchandising = planHomepageMerchandising(products, WINTER_CATEGORIES);
  const galleryBandItems = products.flatMap((product) =>
    product.images.map((image) => ({
      src: image,
      alt: product.name,
    })),
  );

  return (
    <>
      <ProductGrid
        title="Seasonal Care"
        categories={WINTER_CATEGORIES}
        includeProductIds={merchandising.seasonal}
        viewAllHref="/shop/skincare"
        viewAllLabel="Shop skincare"
        initialProducts={products}
        hideWhenEmpty
      />
      <ProductGrid title="Best Sellers" isFeatured includeProductIds={merchandising.bestSellers} initialProducts={products} />
      <ComboSection limit={4} interactive={false} mobileLimit={3} initialCombos={combos} />
      <ProductGrid title="New Arrivals" isNew includeProductIds={merchandising.newArrivals} viewAllHref="/new" viewAllLabel="Shop all new arrivals" initialProducts={products} />
      <ProductGrid
        title="Premium"
        isPremium
        includeProductIds={merchandising.premium}
        viewAllHref="/collections/premium"
        viewAllLabel="Explore premium collection"
        initialProducts={products}
        hideWhenEmpty
      />
      <DirectionalMarquee />
      <ProductGrid title="Accessories" fixedCategory="accessory" includeProductIds={merchandising.accessories} viewAllHref="/shop/accessories" initialProducts={products} />
      <Dec2024GalleryBand items={galleryBandItems} />
      <RealReviews />
    </>
  );
}

export default function Home() {
  const baseUrl = normalizeSiteUrl();

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [organizationJsonLd(baseUrl), webSiteJsonLd(baseUrl)],
        }}
      />
      <Hero />
      <Suspense fallback={<HomeSectionsFallback />}>
        <HomeMerchandisingSections />
      </Suspense>
    </div>
  );
}
