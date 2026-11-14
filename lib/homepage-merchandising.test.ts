import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { getDemoCatalogProducts } from "./demo-catalog.ts";
import { planHomepageMerchandising, type HomepageProduct } from "./homepage-merchandising.ts";

const item = (
  id: string,
  category: string,
  image: string,
  isFeatured = false,
  isNew = false,
  isPremium = false,
): HomepageProduct => ({
  id,
  category,
  images: [image],
  isFeatured,
  isNew,
  isPremium,
});

test("homepage sections do not reuse a product or a primary photograph", () => {
  const catalog = [
    item("cleanser", "skincare", "/cleanser.webp", true, true),
    item("cream", "skincare", "/cream.webp", false, false, true),
    item("face-wash", "skincare", "/wash.webp", true),
    item("shampoo", "haircare", "/shampoo.webp"),
    item("body-butter", "bodycare", "/body-butter.webp"),
    item("serum", "skincare", "/serum.webp", true),
    item("makeup", "makeup", "/makeup.webp", true),
    item("lip", "makeup", "/lip.webp", false, true),
    item("hair-oil", "haircare", "/hair-oil.webp", false, true),
    item("duplicate-photo", "fragrance", "/hair-oil.webp", false, true),
    item("perfume", "fragrance", "/perfume.webp", false, false, true),
    item("pouch", "accessory", "/pouch.webp"),
  ];
  const selected = planHomepageMerchandising(catalog, ["skincare", "haircare", "bodycare"]);
  const sections = [selected.seasonal, selected.bestSellers, selected.newArrivals, selected.premium, selected.accessories];
  const selectedIds = sections.flat();
  assert.equal(selectedIds.length, new Set(selectedIds).size);

  const imageById = new Map(catalog.map((product) => [product.id, product.images[0]]));
  const selectedImages = selectedIds.map((id) => imageById.get(id));
  assert.equal(selectedImages.length, new Set(selectedImages).size);

  assert.ok(selected.seasonal.includes("cream"));
  assert.ok(selected.bestSellers.every((id) => catalog.find((product) => product.id === id)?.isFeatured));
  assert.ok(selected.newArrivals.every((id) => catalog.find((product) => product.id === id)?.isNew));
  assert.ok(selected.premium.every((id) => catalog.find((product) => product.id === id)?.isPremium));
});

test("empty catalog returns empty rows", () => {
  const result = planHomepageMerchandising([], ["skincare"]);
  assert.deepEqual(result.seasonal, []);
  assert.deepEqual(result.bestSellers, []);
  assert.deepEqual(result.newArrivals, []);
  assert.deepEqual(result.premium, []);
  assert.deepEqual(result.accessories, []);
});

test("legacy photo aliases are counted as a single image", () => {
  const products = [
    item("lip", "makeup", "/hero/lipstick.webp", false, true),
    item("pouch", "accessory", "/hero/pouch.webp"),
  ];
  const result = planHomepageMerchandising(products, ["skincare"]);
  assert.deepEqual(result.newArrivals, ["lip"]);
  assert.deepEqual(result.accessories, []);
});

test("products missing images do not repeat the same fallback photo", () => {
  const missingA = item("a", "skincare", "");
  const missingB = item("b", "skincare", "");
  const result = planHomepageMerchandising([missingA, missingB], ["skincare"]);
  assert.deepEqual(result.seasonal, ["a"]);
});

test("actual storefront demo products have distinct featured images per homepage section", () => {
  const catalog = getDemoCatalogProducts().products;
  const plan = planHomepageMerchandising(catalog, ["skincare", "bodycare", "haircare"]);
  // Preserve useful density in each distinct merchandising section.
  assert.equal(plan.seasonal.length, 4);
  assert.equal(plan.bestSellers.length, 4);
  assert.ok(plan.newArrivals.length >= 3);
  assert.ok(plan.premium.length >= 2);
  assert.ok(plan.accessories.length >= 1);
  const ids = [
    ...plan.seasonal,
    ...plan.bestSellers,
    ...plan.newArrivals,
    ...plan.premium,
    ...plan.accessories,
  ];
  const images = ids.map((id) => catalog.find((product) => product.id === id)?.images[0] ?? "");
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(images).size, images.length);
  for (const src of images) {
    assert.ok(src.startsWith("/") && existsSync(`public${src}`), `Missing product photo: ${src}`);
  }
  for (const photo of [
    "rice-water-cleanser",
    "vitamin-c-serum",
    "ceramide-barrier-cream",
    "mens-daily-face-wash",
  ]) {
    assert.ok(existsSync(`public/products/demo/${photo}.webp`), `Missing original demo photo: ${photo}`);
  }
});
