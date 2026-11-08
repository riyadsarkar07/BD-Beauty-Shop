import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildGeneralSearchPhrases,
  mergeMerchandisingSuggestionPool,
  seededShuffle,
} from "./search-suggestions.ts";

const baseProduct = {
  id: "product-1",
  name: "Hydra Glow Serum",
  category: "skincare",
  gender: "women",
  tags: [],
  ingredients: null,
  features: [],
  colors: [],
  isNew: false,
  isPremium: false,
  displayOrder: 0,
  stock: 1,
  searchText: "Hydra Glow Serum skincare women premium serum",
};

test("seeded shuffle changes with different seeds and is stable for the same seed", () => {
  const items = ["a", "b", "c", "d", "e"];

  assert.deepEqual(seededShuffle(items, "open-1"), seededShuffle(items, "open-1"));
  assert.notDeepEqual(seededShuffle(items, "open-1"), seededShuffle(items, "open-2"));
});

test("merchandising suggestion pool merges premium, new, and display buckets, dedupes, excludes sold out, and returns three", () => {
  const result = mergeMerchandisingSuggestionPool({
    seed: "overlay-open",
    limit: 3,
    premiumProducts: [
      { ...baseProduct, id: "premium", isPremium: true },
      { ...baseProduct, id: "duplicate", isPremium: true },
      { ...baseProduct, id: "sold-out", isPremium: true, stock: 0 },
    ],
    newProducts: [
      { ...baseProduct, id: "new", isNew: true },
      { ...baseProduct, id: "duplicate", isNew: true },
    ],
    displayOrderProducts: [
      { ...baseProduct, id: "display", displayOrder: 1000 },
      { ...baseProduct, id: "premium", displayOrder: 900 },
    ],
  });

  assert.equal(result.length, 3);
  assert.equal(new Set(result.map((product) => product.id)).size, 3);
  assert.equal(result.some((product) => product.id === "sold-out"), false);
});

test("general phrase suggestions avoid exact product names and require at least six in-stock matches", () => {
  const rows = Array.from({ length: 6 }, (_, index) => ({
    ...baseProduct,
    id: `makeup-${index}`,
    name: `Velvet Matte Lip Color ${index}`,
    category: "makeup",
    isPremium: true,
    searchText: "Velvet Matte Lip Color premium makeup women",
  }));

  const phrases = buildGeneralSearchPhrases({
    products: [
      ...rows,
      {
        ...baseProduct,
        id: "single-black-makeup",
        name: "Black Kajal",
        category: "makeup",
        colors: [{ name: "Black", hex: "#000000" }],
        searchText: "Black Kajal makeup black",
      },
    ],
    seed: "phrase-open",
    limit: 10,
    minMatches: 6,
  });

  assert.equal(phrases.includes("Velvet Matte Lip Color 1"), false);
  assert.ok(phrases.includes("Premium makeup"));
  assert.equal(phrases.includes("Black makeup"), false);
});

test("general phrase suggestions clean noisy ingredients descriptors", () => {
  const rows = Array.from({ length: 6 }, (_, index) => ({
    ...baseProduct,
    id: `cotton-${index}`,
    name: `Cotton Cleansing Pad ${index}`,
    ingredients: "100%Premium Cotton",
    searchText: "Cotton Cleansing Pad premium cotton skincare",
  }));

  const phrases = buildGeneralSearchPhrases({
    products: rows,
    seed: "ingredients-cleanup",
    limit: 6,
    minMatches: 6,
  });

  assert.ok(phrases.includes("Cotton skincare"));
  assert.equal(phrases.some((phrase) => phrase.includes("%") || /\d/.test(phrase)), false);
});
