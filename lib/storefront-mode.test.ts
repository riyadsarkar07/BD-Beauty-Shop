import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { getDemoCatalogProducts, getDemoComboDetails, getDemoProductDetails, getDemoProductStaticParams } from "./demo-catalog.ts";
import { isStorefrontOnly } from "./storefront-mode.ts";

function read(path: string) {
  return readFileSync(path, "utf8");
}

test("storefront-only mode is on unless explicitly disabled", () => {
  assert.equal(process.env.NEXT_PUBLIC_STOREFRONT_ONLY, undefined);
  assert.equal(isStorefrontOnly(), true);
});

test("demo catalog covers core merchandising surfaces", () => {
  const all = getDemoCatalogProducts();
  const slugs = getDemoProductStaticParams().map((item) => item.slug);
  const skincare = getDemoCatalogProducts({ category: "skincare" });
  const men = getDemoCatalogProducts({ gender: "men" });
  const search = getDemoCatalogProducts({ search: "jasmine" });
  const detail = getDemoProductDetails("rice-water-bright-cleanser");
  const combo = getDemoComboDetails("b1c2d3e4-f5a6-41b1-8901-000000000001");

  assert.ok(all.products.length >= 16);
  assert.ok(slugs.includes("rice-water-bright-cleanser"));
  assert.ok(skincare.products.every((product) => product.category === "skincare"));
  assert.ok(men.products.every((product) => product.gender === "men" || product.gender === "unisex"));
  assert.equal(search.products[0]?.slug, "jasmine-night-eau-de-parfum");
  assert.equal(detail?.slug, "rice-water-bright-cleanser");
  assert.ok((detail?.relatedProducts.length ?? 0) > 0);
  assert.equal(combo?.productA.slug, "rice-water-bright-cleanser");
  assert.equal(combo?.productB.slug, "vitamin-c-glow-serum");
});

test("auth and database stay import-safe without credentials", () => {
  const auth = read("lib/auth.ts");
  const db = read("lib/db/index.ts");
  const couponRoute = read("app/api/coupons/validate/route.ts");
  const authRoute = read("app/api/auth/[...all]/route.ts");

  assert.match(auth, /isStorefrontOnly\(\)/);
  assert.doesNotMatch(auth, /throw new Error\("CRITICAL VULNERABILITY/);
  assert.match(db, /isStorefrontOnly\(\)/);
  assert.match(couponRoute, /storefrontUnavailableResponse\("Coupons"\)/);
  assert.match(authRoute, /isStorefrontOnly\(\) \|\| !auth/);
});

test("public catalog loaders prefer demo data in storefront-only mode", () => {
  const catalog = read("lib/product-catalog.ts");
  const detail = read("lib/product-detail.ts");
  const combos = read("lib/combos.ts");
  const sitemap = read("app/sitemap.ts");

  assert.match(catalog, /getDemoCatalogProducts\(query\)/);
  assert.match(detail, /getDemoProductStaticParams\(\)/);
  assert.match(detail, /getDemoProductDetails\(slugOrId\)/);
  assert.match(combos, /getDemoCombosWithProducts\(limit\)/);
  assert.match(sitemap, /getDemoSitemapProducts\(\)/);
  assert.equal(existsSync("data/demo-catalog.json"), true);
});
