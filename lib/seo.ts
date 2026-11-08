import type { ProductCategory } from "./product-categories.ts";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FREE_SHIPPING_THRESHOLD,
  OUTSIDE_DHAKA_SHIPPING_FEE,
  STORE_COUNTRY,
  STORE_COUNTRY_CODE,
  STORE_LOCALITY,
  STORE_REGION,
} from "./constants.ts";

export const SITE_NAME = "BD Beauty Shop";
export const SITE_BRAND_LINE = "Beauty, delivered across Bangladesh";
export const DEFAULT_SITE_URL = "https://bdbeautyshop.com";
export const DEFAULT_OG_IMAGE = "/logo.jpeg";

export const SITE_DESCRIPTION =
  "BD Beauty Shop is a premium Bangladesh beauty store for skincare, makeup, haircare, fragrance, and wellness, with Cash on Delivery and nationwide delivery.";

export const SEO_CONTACT = {
  email: CONTACT_EMAIL,
  phone: CONTACT_PHONE,
  locality: STORE_LOCALITY,
  region: STORE_REGION,
  country: STORE_COUNTRY_CODE,
  countryName: STORE_COUNTRY,
  availableLanguage: ["English", "Bengali"],
};

export const SEO_SHIPPING = {
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  standardShippingFee: OUTSIDE_DHAKA_SHIPPING_FEE,
  currency: "BDT",
  country: STORE_COUNTRY_CODE,
};

export function normalizeSiteUrl(baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_SITE_URL) {
  return baseUrl.replace(/\/+$/, "");
}

export function buildAbsoluteUrl(path: string, baseUrl?: string) {
  const normalizedBase = normalizeSiteUrl(baseUrl);
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildProductPath(slug: string) {
  return `/product/${slug}`;
}

export function buildProductUrl(slug: string, baseUrl?: string) {
  return buildAbsoluteUrl(buildProductPath(slug), baseUrl);
}

export function isProductUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const CATALOG_NOINDEX_PARAMS = new Set([
  "search",
  "size",
  "minPrice",
  "maxPrice",
  "isNew",
  "isFeatured",
  "isPremium",
]);

export function shouldNoindexCatalogQuery(searchParams: URLSearchParams) {
  for (const key of searchParams.keys()) {
    if (CATALOG_NOINDEX_PARAMS.has(key)) return true;
  }
  return false;
}

export type { ProductCategory };

export type CategorySeo = {
  slug: string;
  category: ProductCategory;
  label: string;
  title: string;
  h1: string;
  subtitle: string;
  description: string;
  intro: string;
  faq: { question: string; answer: string }[];
};

export const CATEGORY_SEO: CategorySeo[] = [
  {
    slug: "skincare",
    category: "skincare",
    label: "Skincare",
    title: "Skincare",
    h1: "Skincare",
    subtitle: "Cleansers, serums, moisturizers, and daily skin rituals.",
    description:
      "Shop skincare at BD Beauty Shop. Browse cleansers, serums, moisturizers, and everyday skin care with Cash on Delivery across Bangladesh.",
    intro:
      "Skincare at BD Beauty Shop is merchandised for daily routines. Product pages show live stock and any details provided by the catalog.",
    faq: [
      {
        question: "Does BD Beauty Shop ship skincare across Bangladesh?",
        answer:
          "Yes. Orders ship nationwide, with Cash on Delivery available and free shipping above the sitewide order threshold.",
      },
    ],
  },
  {
    slug: "makeup",
    category: "makeup",
    label: "Makeup",
    title: "Makeup",
    h1: "Makeup",
    subtitle: "Face, eyes, lips, and finishing color.",
    description:
      "Shop makeup at BD Beauty Shop, including face, eye, and lip products with nationwide delivery in Bangladesh.",
    intro:
      "Makeup listings keep shade and stock details on the product page. Only information supplied in the catalog is shown.",
    faq: [
      {
        question: "Can I order makeup with Cash on Delivery?",
        answer: "Yes. Cash on Delivery is available across Bangladesh at checkout.",
      },
    ],
  },
  {
    slug: "haircare",
    category: "haircare",
    label: "Haircare",
    title: "Haircare",
    h1: "Haircare",
    subtitle: "Shampoo, treatments, oils, and styling care.",
    description:
      "Shop haircare at BD Beauty Shop. Browse shampoos, treatments, and oils with delivery across Bangladesh.",
    intro:
      "Haircare products are listed with the details available from the catalog. Stock and price are always server-verified.",
    faq: [
      {
        question: "Are haircare products delivered outside Dhaka?",
        answer:
          "Yes. Delivery is available nationwide, with a higher delivery charge outside Dhaka metro unless the order reaches the free-shipping threshold.",
      },
    ],
  },
  {
    slug: "fragrance",
    category: "fragrance",
    label: "Fragrance",
    title: "Fragrance",
    h1: "Fragrance",
    subtitle: "Perfumes and body mists.",
    description:
      "Shop fragrance at BD Beauty Shop. Browse perfumes and body mists with Cash on Delivery in Bangladesh.",
    intro:
      "Fragrance pages only show names, images, prices, and descriptions that exist in the catalog.",
    faq: [
      {
        question: "Do fragrance products include invented notes or claims?",
        answer:
          "No. BD Beauty Shop does not invent ingredients, notes, or product claims. Missing details stay blank until an admin adds them.",
      },
    ],
  },
  {
    slug: "bodycare",
    category: "bodycare",
    label: "Bodycare",
    title: "Bodycare",
    h1: "Bodycare",
    subtitle: "Lotions, washes, and body treatments.",
    description:
      "Shop bodycare at BD Beauty Shop, including lotions, washes, and body treatments delivered across Bangladesh.",
    intro:
      "Bodycare is merchandised as everyday self-care. Catalog details are preserved exactly as imported or entered by admin.",
    faq: [
      {
        question: "How are bodycare prices shown?",
        answer: "All prices are in Bangladeshi Taka (৳) and recalculated by the server at checkout.",
      },
    ],
  },
  {
    slug: "nailcare",
    category: "nailcare",
    label: "Nailcare",
    title: "Nailcare",
    h1: "Nailcare",
    subtitle: "Polishes, treatments, and nail kits.",
    description:
      "Shop nailcare at BD Beauty Shop, including polishes and nail kits with delivery across Bangladesh.",
    intro:
      "Nailcare listings keep shade names when provided. Empty fields mean the source did not include that information.",
    faq: [
      {
        question: "Can I filter nailcare by shade?",
        answer: "Where shade variants exist, they appear on the product page. Filters use live catalog data.",
      },
    ],
  },
  {
    slug: "tools",
    category: "tools",
    label: "Beauty Tools",
    title: "Beauty Tools",
    h1: "Beauty Tools",
    subtitle: "Brushes, applicators, and grooming tools.",
    description:
      "Shop beauty tools at BD Beauty Shop, including brushes and applicators with nationwide Bangladesh delivery.",
    intro:
      "Tools are single-SKU unless the catalog supplies variants. Stock is shown on each product page.",
    faq: [
      {
        question: "Are beauty tools one size?",
        answer: "Most tools are listed as one size unless a variant is provided in the catalog.",
      },
    ],
  },
  {
    slug: "kits",
    category: "kits",
    label: "Kits & Sets",
    title: "Kits & Sets",
    h1: "Kits & Sets",
    subtitle: "Gift sets and bundled beauty routines.",
    description:
      "Shop beauty kits and sets at BD Beauty Shop. Bundled routines and gift sets with Cash on Delivery in Bangladesh.",
    intro:
      "Kits are merchandised as complete routines. Combo discounts, when configured, are applied server-side at checkout.",
    faq: [
      {
        question: "Do kits include combo discounts?",
        answer:
          "Some kits may also appear as combos. Checkout always recalculates discounts from the database.",
      },
    ],
  },
  {
    slug: "wellness",
    category: "wellness",
    label: "Wellness",
    title: "Wellness",
    h1: "Wellness",
    subtitle: "Self-care extras beyond the makeup bag.",
    description:
      "Shop wellness products at BD Beauty Shop with nationwide delivery and Cash on Delivery in Bangladesh.",
    intro:
      "Wellness listings only include information supplied in the catalog. No health claims are invented.",
    faq: [
      {
        question: "Does BD Beauty Shop invent wellness claims?",
        answer: "No. Missing specifications stay blank or marked for admin review.",
      },
    ],
  },
  {
    slug: "accessories",
    category: "accessory",
    label: "Accessories",
    title: "Beauty Accessories",
    h1: "Beauty Accessories",
    subtitle: "Pouches, mirrors, and finishing extras.",
    description:
      "Shop beauty accessories at BD Beauty Shop, including pouches and finishing extras with delivery across Bangladesh.",
    intro:
      "Accessories are kept focused: finishing extras that support a beauty routine rather than cluttering it.",
    faq: [
      {
        question: "What accessories does BD Beauty Shop sell?",
        answer:
          "Accessories include pouches, mirrors, and selected extras currently active in the catalog.",
      },
    ],
  },
];

export function getCategorySeoBySlug(slug: string) {
  return CATEGORY_SEO.find((item) => item.slug === slug) ?? null;
}

export function getCategorySeoByCategory(category: string) {
  return CATEGORY_SEO.find((item) => item.category === category) ?? null;
}

export function productTypeLabel(category: string) {
  return getCategorySeoByCategory(category)?.label ?? category;
}
