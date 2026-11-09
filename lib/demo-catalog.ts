import demoCatalog from "../data/demo-catalog.json" with { type: "json" };
import type { ProductCategory } from "./product-categories.ts";
import { isProductUuid } from "./seo.ts";

const PRODUCT_RECOMMENDATION_LIMIT = 16;

function mergeRelatedProductIds({
  storedIds,
  heuristicIds,
  newestIds,
  excludedIds,
  limit = PRODUCT_RECOMMENDATION_LIMIT,
}: {
  storedIds: string[];
  heuristicIds: string[];
  newestIds: string[];
  excludedIds: Set<string>;
  limit?: number;
}) {
  const seen = new Set(excludedIds);
  const merged: string[] = [];

  for (const productId of [...storedIds, ...heuristicIds, ...newestIds]) {
    if (seen.has(productId)) continue;
    seen.add(productId);
    merged.push(productId);
    if (limit !== undefined && merged.length >= limit) break;
  }

  return merged;
}

export type DemoProductColor = {
  name: string;
  hex: string;
  images?: string[];
};

export type DemoProductVariant = {
  id: string;
  size: string;
  color: string | null;
  stock: number;
};

export type DemoProductRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  mrp: string;
  sellingPrice: string;
  maxBargainDiscount: string;
  category: ProductCategory;
  gender: "men" | "women" | "unisex";
  brand: string | null;
  sku: string | null;
  tags: string[];
  stock: number;
  images: string[];
  ingredients: string | null;
  volume: number | null;
  careInstructions: string[];
  features: string[];
  sizes: string[];
  colors: DemoProductColor[];
  searchText: string;
  isNew: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  isActive: boolean;
  displayOrder: number;
  variants: DemoProductVariant[];
};

export type DemoComboRecord = {
  id: string;
  productAId: string;
  productBId: string;
  discountAmount: string;
  isActive: boolean;
  displayOrder: number;
};

export type DemoCatalogQuery = {
  category?: string | null;
  gender?: string | null;
  search?: string | null;
  size?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  isNew?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  limit?: number;
  offset?: number;
  includeTotal?: boolean;
};

const DEMO_CREATED_AT = new Date("2026-06-01T00:00:00.000Z");

const demoProducts = demoCatalog.products as DemoProductRecord[];
const demoCombos = demoCatalog.combos as DemoComboRecord[];

function availableSizesFor(product: DemoProductRecord) {
  const sizes = product.variants
    .filter((variant) => variant.stock > 0)
    .map((variant) => variant.size);
  const unique = Array.from(new Set(sizes));
  if (unique.length > 0) return unique;
  return product.stock > 0 ? product.sizes : [];
}

export function getDemoProducts() {
  return demoProducts.filter((product) => product.isActive);
}

export function getDemoCombos() {
  return demoCombos.filter((combo) => combo.isActive);
}

export function toCatalogProduct(product: DemoProductRecord) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sellingPrice: product.sellingPrice,
    mrp: product.mrp,
    maxBargainDiscount: product.maxBargainDiscount,
    category: product.category,
    gender: product.gender,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isPremium: product.isPremium,
    stock: product.stock,
    images: product.images,
    sizes: product.sizes,
    colors: product.colors,
    availableSizes: availableSizesFor(product),
  };
}

function relatedScore(
  target: { category: string; gender: string },
  candidate: { category: string; gender: string },
) {
  let score = 0;
  if (candidate.category === target.category) score += 4;
  if (candidate.gender === target.gender) score += 3;
  else if (target.gender !== "unisex" && candidate.gender === "unisex") score += 2;
  return score;
}

function productRow(product: DemoProductRecord) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    mrp: product.mrp,
    sellingPrice: product.sellingPrice,
    maxBargainDiscount: product.maxBargainDiscount,
    category: product.category,
    gender: product.gender,
    brand: product.brand,
    sku: product.sku,
    tags: product.tags,
    stock: product.stock,
    images: product.images,
    ingredients: product.ingredients,
    volume: product.volume,
    careInstructions: product.careInstructions,
    features: product.features,
    sizes: product.sizes,
    colors: product.colors,
    searchText: product.searchText,
    searchTokens: product.searchText,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isPremium: product.isPremium,
    isActive: product.isActive,
    displayOrder: product.displayOrder,
    createdAt: DEMO_CREATED_AT,
    updatedAt: DEMO_CREATED_AT,
  };
}

function variantRows(product: DemoProductRecord) {
  return product.variants.map((variant) => ({
    id: variant.id,
    productId: product.id,
    size: variant.size,
    color: variant.color,
    stock: variant.stock,
    createdAt: DEMO_CREATED_AT,
    updatedAt: DEMO_CREATED_AT,
  }));
}

function findProduct(id: string) {
  return getDemoProducts().find((product) => product.id === id) ?? null;
}

function comboWithProducts(combo: DemoComboRecord) {
  const productA = findProduct(combo.productAId);
  const productB = findProduct(combo.productBId);
  if (!productA || !productB) return null;

  return {
    id: combo.id,
    productAId: combo.productAId,
    productBId: combo.productBId,
    discountAmount: combo.discountAmount,
    isActive: combo.isActive,
    displayOrder: combo.displayOrder,
    createdAt: DEMO_CREATED_AT,
    updatedAt: DEMO_CREATED_AT,
    productA: {
      ...productRow(productA),
      variants: variantRows(productA),
    },
    productB: {
      ...productRow(productB),
      variants: variantRows(productB),
    },
  };
}

function matchesQuery(product: DemoProductRecord, query: DemoCatalogQuery) {
  if (query.category && product.category !== query.category) return false;
  if (query.gender && product.gender !== query.gender && product.gender !== "unisex") return false;
  if (query.isNew && !product.isNew) return false;
  if (query.isFeatured && !product.isFeatured) return false;
  if (query.isPremium && !product.isPremium) return false;

  const price = Number(product.sellingPrice);
  if (query.minPrice && price < Number(query.minPrice)) return false;
  if (query.maxPrice && price > Number(query.maxPrice)) return false;

  if (query.size) {
    const hasSize = product.variants.some((variant) => variant.size === query.size && variant.stock > 0);
    if (!hasSize) return false;
  }

  const search = query.search?.trim().toLowerCase();
  if (search) {
    const haystack = [
      product.name,
      product.category,
      product.gender,
      product.searchText,
      product.brand ?? "",
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(search)) return false;
  }

  return true;
}

export function getDemoCatalogProducts(query: DemoCatalogQuery = {}) {
  const matched = getDemoProducts()
    .filter((product) => matchesQuery(product, query))
    .sort((a, b) => b.displayOrder - a.displayOrder);

  const offset = query.offset || 0;
  const limit = query.limit ?? matched.length;
  const page = matched.slice(offset, offset + limit).map(toCatalogProduct);

  return {
    products: page,
    total: matched.length,
    limit,
    offset,
  };
}

export function getDemoProductStaticParams() {
  return getDemoProducts().map((product) => ({ slug: product.slug }));
}

export function getDemoComboStaticParams() {
  return getDemoCombos().map((combo) => ({ id: combo.id }));
}

export function getDemoCombosWithProducts(limit = 6) {
  return getDemoCombos()
    .sort((a, b) => b.displayOrder - a.displayOrder)
    .map(comboWithProducts)
    .filter((combo): combo is NonNullable<typeof combo> => combo !== null)
    .slice(0, limit);
}

export function getDemoComboDetails(id: string) {
  const combo = getDemoCombos().find((item) => item.id === id);
  if (!combo) return null;
  return comboWithProducts(combo);
}

export function getDemoProductDetails(slugOrId: string) {
  const products = getDemoProducts();
  const product = products.find((item) =>
    isProductUuid(slugOrId) ? item.id === slugOrId || item.slug === slugOrId : item.slug === slugOrId,
  );
  if (!product) return null;

  const relatedComboRows = getDemoCombos().filter(
    (combo) => combo.productAId === product.id || combo.productBId === product.id,
  );
  const relatedCombos = relatedComboRows
    .map(comboWithProducts)
    .filter((combo): combo is NonNullable<typeof combo> => combo !== null);

  const excludedIds = new Set([
    product.id,
    ...relatedComboRows.map((combo) => (combo.productAId === product.id ? combo.productBId : combo.productAId)),
  ]);

  const heuristicIds = products
    .filter((candidate) => !excludedIds.has(candidate.id) && relatedScore(product, candidate) > 0)
    .sort((a, b) => {
      const scoreDelta = relatedScore(product, b) - relatedScore(product, a);
      if (scoreDelta !== 0) return scoreDelta;
      return b.displayOrder - a.displayOrder;
    })
    .map((candidate) => candidate.id);

  const newestIds = products.map((candidate) => candidate.id);
  const relatedProductIds = mergeRelatedProductIds({
    storedIds: [],
    heuristicIds,
    newestIds,
    excludedIds,
    limit: PRODUCT_RECOMMENDATION_LIMIT,
  });

  const relatedProducts = relatedProductIds
    .map((id) => products.find((item) => item.id === id))
    .filter((item): item is DemoProductRecord => item !== undefined)
    .map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      mrp: item.mrp,
      sellingPrice: item.sellingPrice,
      images: item.images,
      sizes: item.sizes,
      stock: item.stock,
      availableSizes: availableSizesFor(item),
    }));

  return {
    ...productRow(product),
    variants: variantRows(product),
    relatedCombos,
    relatedProducts,
  };
}

export function getDemoSitemapProducts() {
  return getDemoProducts().map((product) => ({
    slug: product.slug,
    updatedAt: DEMO_CREATED_AT,
  }));
}

export function getDemoMerchantProducts() {
  return getDemoProducts().map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    images: product.images,
    sellingPrice: product.sellingPrice,
    mrp: product.mrp,
    stock: product.stock,
    category: product.category,
    gender: product.gender,
  }));
}

export function getDemoSuggestionProducts() {
  return getDemoProducts().map((product) => ({
    ...toCatalogProduct(product),
    tags: product.tags,
    ingredients: product.ingredients,
    features: product.features,
    displayOrder: product.displayOrder,
    searchText: product.searchText,
  }));
}
