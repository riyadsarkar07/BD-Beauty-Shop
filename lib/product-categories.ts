export const PRODUCT_CATEGORIES = [
  "skincare",
  "makeup",
  "haircare",
  "fragrance",
  "bodycare",
  "nailcare",
  "tools",
  "kits",
  "wellness",
  "accessory",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, { singular: string; plural: string; bn: string }> = {
  skincare: { singular: "Skincare", plural: "Skincare", bn: "স্কিনকেয়ার" },
  makeup: { singular: "Makeup", plural: "Makeup", bn: "মেকআপ" },
  haircare: { singular: "Haircare", plural: "Haircare", bn: "হেয়ারকেয়ার" },
  fragrance: { singular: "Fragrance", plural: "Fragrance", bn: "ফ্র্যাগ্রেন্স" },
  bodycare: { singular: "Bodycare", plural: "Bodycare", bn: "বডি কেয়ার" },
  nailcare: { singular: "Nailcare", plural: "Nailcare", bn: "নেইল কেয়ার" },
  tools: { singular: "Beauty Tool", plural: "Beauty Tools", bn: "বিউটি টুলস" },
  kits: { singular: "Kit", plural: "Kits & Sets", bn: "কিট ও সেট" },
  wellness: { singular: "Wellness", plural: "Wellness", bn: "ওয়েলনেস" },
  accessory: { singular: "Accessory", plural: "Accessories", bn: "এক্সেসরিজ" },
}

export const SHADE_CATEGORIES: readonly ProductCategory[] = ["makeup", "nailcare"]

export const SINGLE_SKU_CATEGORIES: readonly ProductCategory[] = [
  "skincare",
  "haircare",
  "fragrance",
  "bodycare",
  "tools",
  "kits",
  "wellness",
  "accessory",
]

export const FEATURED_HOME_CATEGORIES: readonly ProductCategory[] = ["skincare", "makeup", "haircare"]

export const BRIDAL_CATEGORIES: readonly ProductCategory[] = ["makeup", "kits", "fragrance"]

export const WINTER_CATEGORIES: readonly ProductCategory[] = ["skincare", "bodycare", "haircare"]

export function isProductCategory(value: unknown): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory)
}

export function isSingleSkuCategory(category: string) {
  return SINGLE_SKU_CATEGORIES.includes(category as ProductCategory)
}

export function isShadeCategory(category: string) {
  return SHADE_CATEGORIES.includes(category as ProductCategory)
}
