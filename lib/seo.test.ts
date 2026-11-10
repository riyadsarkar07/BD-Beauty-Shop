import test from "node:test";
import assert from "node:assert/strict";

import {
  CATEGORY_SEO,
  buildAbsoluteUrl,
  buildProductPath,
  buildProductUrl,
  getCategorySeoBySlug,
  isProductUuid,
  normalizeSiteUrl,
  shouldNoindexCatalogQuery,
} from "./seo.ts";
import { buildGoogleMerchantFeed } from "./seo-merchant-feed.ts";
import {
  collectionJsonLd,
  organizationJsonLd,
  productJsonLd,
  webSiteJsonLd,
} from "./structured-data.ts";

test("SEO URL helpers normalize base URLs and product slugs", () => {
  assert.equal(normalizeSiteUrl("https://bdbeautyshop.com/"), "https://bdbeautyshop.com");
  assert.equal(buildAbsoluteUrl("/shop/men", "https://bdbeautyshop.com/"), "https://bdbeautyshop.com/shop/men");
  assert.equal(buildProductPath("seoul-black-tee"), "/product/seoul-black-tee");
  assert.equal(buildProductUrl("seoul-black-tee", "https://bdbeautyshop.com/"), "https://bdbeautyshop.com/product/seoul-black-tee");
});

test("SEO URL helpers identify UUID product URLs separately from slugs", () => {
  assert.equal(isProductUuid("3f0f2a6a-1c8a-4b38-a6da-2450a03f23bb"), true);
  assert.equal(isProductUuid("seoul-black-tee"), false);
});

test("category SEO config covers every public category slug", () => {
  const slugs = CATEGORY_SEO.map((item) => item.slug);

  assert.deepEqual(slugs, [
    "skincare",
    "makeup",
    "haircare",
    "fragrance",
    "bodycare",
    "nailcare",
    "tools",
    "kits",
    "wellness",
    "accessories",
  ]);
  assert.equal(getCategorySeoBySlug("skincare")?.category, "skincare");
  assert.equal(getCategorySeoBySlug("accessories")?.category, "accessory");
  assert.equal(getCategorySeoBySlug("unknown"), null);
});

test("catalog query duplicate policy noindexes search and filter variants only", () => {
  assert.equal(shouldNoindexCatalogQuery(new URLSearchParams()), false);
  assert.equal(shouldNoindexCatalogQuery(new URLSearchParams("search=tee")), true);
  assert.equal(shouldNoindexCatalogQuery(new URLSearchParams("size=M")), true);
  assert.equal(shouldNoindexCatalogQuery(new URLSearchParams("utm_source=instagram")), false);
});

test("structured data uses real organization, search, product, and collection URLs", () => {
  const baseUrl = "https://bdbeautyshop.com";
  const organization = organizationJsonLd(baseUrl);
  const website = webSiteJsonLd(baseUrl);
  const product = productJsonLd(baseUrl, {
    id: "3f0f2a6a-1c8a-4b38-a6da-2450a03f23bb",
    slug: "seoul-black-tee",
    name: "Seoul Black Tee",
    description: "Oversized black tee in heavyweight cotton.",
    images: ["/clothes/seoul.jpg"],
    sellingPrice: "899",
    mrp: "1299",
    stock: 4,
    category: "skincare",
    sizes: ["M", "L"],
    colors: [{ name: "Black", hex: "#111111" }],
    updatedAt: new Date("2026-06-01T00:00:00.000Z"),
  });
  const collection = collectionJsonLd(baseUrl, {
    name: "Skincare - Beauty Room",
    description: "Cleansers, serums, and daily skin rituals.",
    url: "/shop/skincare",
    products: [
      {
        name: "Seoul Black Tee",
        slug: "seoul-black-tee",
        image: "/clothes/seoul.jpg",
        sellingPrice: "899",
      },
    ],
  });

  assert.equal(organization["@type"], "OnlineStore");
  assert.equal(organization.address.addressLocality, "Narsingdi");
  assert.equal(website.potentialAction.target.urlTemplate, "https://bdbeautyshop.com/shop?search={search_term_string}");
  assert.equal(product.offers.url, "https://bdbeautyshop.com/product/seoul-black-tee");
  assert.equal(product.sku, "3f0f2a6a-1c8a-4b38-a6da-2450a03f23bb");
  assert.equal(product.offers.hasMerchantReturnPolicy["@type"], "MerchantReturnPolicy");
  assert.equal(collection.mainEntity["@type"], "ItemList");
  assert.equal(collection.mainEntity.itemListElement[0].url, "https://bdbeautyshop.com/product/seoul-black-tee");
});

test("merchant feed serializes active products with slug links and no invented review data", () => {
  const feed = buildGoogleMerchantFeed({
    baseUrl: "https://bdbeautyshop.com",
    products: [
      {
        id: "3f0f2a6a-1c8a-4b38-a6da-2450a03f23bb",
        slug: "seoul-black-tee",
        name: "Seoul Black Tee",
        description: "Oversized black tee in heavyweight cotton.",
        images: ["/clothes/seoul.jpg"],
        sellingPrice: "899",
        mrp: "1299",
        stock: 4,
        category: "skincare",
        gender: "unisex",
      },
    ],
  });

  assert.match(feed, /<g:id>3f0f2a6a-1c8a-4b38-a6da-2450a03f23bb<\/g:id>/);
  assert.match(feed, /<link>https:\/\/bdbeautyshop.com\/product\/seoul-black-tee<\/link>/);
  assert.match(feed, /<g:availability>in_stock<\/g:availability>/);
  assert.match(feed, /<g:google_product_category>Health &amp; Beauty<\/g:google_product_category>/);
  assert.doesNotMatch(feed, /review|rating/i);
});
