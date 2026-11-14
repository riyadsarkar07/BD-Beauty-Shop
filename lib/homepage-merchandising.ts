/**
 * Select independent homepage merchandising rows from one catalog.
 * A product (and its primary image) may appear in at most one section.
 * Product flags remain authoritative: this function never invents bestseller
 * or new-arrival status.
 */
export type HomepageProduct = {
  id: string;
  category: string;
  images: readonly string[];
  isFeatured: boolean;
  isNew: boolean;
  isPremium: boolean;
};

export function planHomepageMerchandising<T extends HomepageProduct>(
  products: readonly T[],
  seasonalCategories: readonly string[],
) {
  const usedProductIds = new Set<string>();
  const usedPrimaryImages = new Set<string>();

  // These two legacy public assets have the same Git blob SHA, despite
  // different filenames. Treat them as one photograph when curating rows.
  const canonicalPhoto = (src: string) =>
    src === "/hero/pouch.webp" ? "/hero/lipstick.webp" : src;

  const allocate = (candidates: readonly T[], max: number) => {
    const chosen: string[] = [];
    for (const product of candidates) {
      const image = canonicalPhoto(product.images[0]?.trim() || "/hero/image.webp");
      if (usedProductIds.has(product.id) || (image && usedPrimaryImages.has(image))) continue;

      chosen.push(product.id);
      usedProductIds.add(product.id);
      if (image) usedPrimaryImages.add(image);
      if (chosen.length >= max) break;
    }
    return chosen;
  };

  // Reserve new/featured items for their dedicated sections before populating
  // the seasonal row. Prefer other relevant skincare/body/haircare products.
  const seasonalCandidates = products
    .filter((product) => seasonalCategories.includes(product.category))
    .map((product, index) => ({
      product,
      index,
      penalty: Number(product.isFeatured) + Number(product.isNew),
    }))
    .sort((a, b) => a.penalty - b.penalty || a.index - b.index)
    .map(({ product }) => product);

  const seasonal = allocate(seasonalCandidates, 4);
  const bestSellers = allocate(products.filter((product) => product.isFeatured), 8);
  const newArrivals = allocate(products.filter((product) => product.isNew), 8);
  const premium = allocate(products.filter((product) => product.isPremium), 8);
  const accessories = allocate(products.filter((product) => product.category === "accessory"), 8);

  return {
    seasonal,
    bestSellers,
    newArrivals,
    premium,
    accessories,
    usedProductIds,
    usedPrimaryImages,
  };
}
