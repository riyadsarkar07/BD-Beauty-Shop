import assert from "node:assert/strict";
import { test } from "node:test";
import { filterCatalogProducts } from "./catalog-filter.ts";
import type { CatalogProduct } from "./product-catalog.ts";
import { WINTER_CATEGORIES } from "./product-categories.ts";

function product(overrides: Partial<CatalogProduct>): CatalogProduct {
  return {
    id: "product-id",
    name: "Product",
    slug: "product",
    sellingPrice: "999.00",
    mrp: "1299.00",
    maxBargainDiscount: "0",
    category: "skincare",
    gender: "unisex",
    isNew: false,
    isFeatured: false,
    isPremium: false,
    stock: 10,
    images: [],
    sizes: ["S", "M"],
    colors: [],
    availableSizes: ["S", "M"],
    ...overrides,
  };
}

test("filterCatalogProducts returns only premium products when requested", () => {
  const products = [
    product({ id: "regular", isPremium: false }),
    product({ id: "premium", isPremium: true }),
  ];

  assert.deepEqual(
    filterCatalogProducts(products, { isPremium: true }).map((item) => item.id),
    ["premium"],
  );
});

test("filterCatalogProducts narrows products by search query", () => {
  const products = [
    product({ id: "polo", name: "Oversized Polo Tee" }),
    product({ id: "cargo", name: "Utility Cargo Pants" }),
  ];

  assert.deepEqual(
    filterCatalogProducts(products, { searchQuery: "polo" }).map((item) => item.id),
    ["polo"],
  );
});

test("filterCatalogProducts keeps only winter categories for the winter collection", () => {
  const products = [
    product({ id: "makeup", category: "makeup" }),
    product({ id: "skincare", category: "skincare" }),
    product({ id: "bodycare", category: "bodycare" }),
    product({ id: "haircare", category: "haircare" }),
    product({ id: "fragrance", category: "fragrance" }),
  ];

  assert.deepEqual(
    filterCatalogProducts(products, { categories: WINTER_CATEGORIES }).map((item) => item.id),
    ["skincare", "bodycare", "haircare"],
  );
});
