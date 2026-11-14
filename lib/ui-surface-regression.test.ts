import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

function read(path: string) {
  return readFileSync(path, "utf8");
}

test("gallery hides the shared footer through a route-aware shell", () => {
  const layout = read("app/layout.tsx");
  const gate = read("components/layout/footer-gate.tsx");

  assert.match(layout, /<FooterGate \/>/);
  assert.match(gate, /usePathname/);
  assert.match(gate, /pathname === "\/gallery"/);
});

test("home streams the hero before data-dependent merchandising sections", () => {
  const page = read("app/page.tsx");

  assert.match(page, /export default function Home\(\)/);
  assert.doesNotMatch(page, /export default async function Home/);
  assert.match(page, /<Hero \/>[\s\S]*<Suspense fallback={<HomeSectionsFallback \/>}>[\s\S]*<HomeMerchandisingSections \/>[\s\S]*<\/Suspense>/);
  assert.match(page, /async function HomeMerchandisingSections\(\)/);
  assert.match(page, /function HomeSectionsFallback\(\)/);
});

test("home merchandising keeps one complete catalog for section density", () => {
  const page = read("app/page.tsx");

  assert.match(page, /const \[\{ products \}, combos\] = await Promise\.all\(\[/);
  assert.match(page, /getCatalogProducts\(\)/);
  assert.match(page, /product\.images\.map/);
  assert.match(page, /initialProducts={products}/);
  assert.doesNotMatch(page, /getCatalogProducts\(\{ isNew: true, limit: 8 \}\)/);
  assert.doesNotMatch(page, /getCatalogProducts\(\{ isPremium: true, limit: 8 \}\)/);
  assert.doesNotMatch(page, /getCatalogProducts\(\{ category: "accessory", limit: 8 \}\)/);
});

test("gallery band dedupes product images instead of repeating carousel tiles", () => {
  const galleryBand = read("components/features/dec2024-gallery-band.tsx");

  assert.match(galleryBand, /function uniqueBySrc/);
  assert.match(galleryBand, /uniqueBySrc\(\[...uniqueProductImages, ...uniqueFallbackImages\]\)\.slice\(0, 32\)/);
  assert.doesNotMatch(galleryBand, /while \(repeated\.length < 32\)/);
});

test("root route suspense reserves the first viewport instead of exposing the footer", () => {
  const layout = read("app/layout.tsx");

  assert.match(layout, /function RouteShellFallback\(\)/);
  assert.match(layout, /<Suspense fallback={<RouteShellFallback \/>}>{children}<\/Suspense>/);
  assert.doesNotMatch(layout, /<Suspense fallback={null}>{children}<\/Suspense>/);
});

test("product route loading shell matches the loaded desktop product layout", () => {
  const loading = read("app/product/[slug]/loading.tsx");

  assert.match(loading, /bg-background pb-24 lg:pt-6/);
  assert.match(loading, /grid grid-cols-1 lg:grid-cols-2 gap-0/);
  assert.match(loading, /aspect-\[4\/5\]/);
  assert.match(loading, /lg:min-h-\[calc\(100svh-8rem\)\] lg:sticky lg:top-20/);
  assert.match(loading, /descriptionLineWidths/);
  assert.match(loading, /"w-\[92%\]"/);
  assert.match(loading, /border-t border-border\/60 mt-24 px-6 md:px-12 lg:px-16/);
  assert.match(loading, /You may also like/);
});

test("public product links use slugs while product actions keep ids", () => {
  const shopClient = read("components/features/shop-client.tsx");
  const productGrid = read("components/features/product-grid.tsx");
  const productClient = read("components/features/product-client.tsx");
  const wishlistClient = read("components/features/wishlist-client.tsx");
  const marketingEmail = read("lib/marketing/email-template.ts");

  assert.match(shopClient, /buildProductPath\(product\.slug\)/);
  assert.match(productGrid, /buildProductPath\(product\.slug\)/);
  assert.match(productClient, /buildProductPath\(related\.slug\)/);
  assert.match(wishlistClient, /buildProductPath\(item\.slug\)/);
  assert.match(marketingEmail, /buildProductUrl\(product\.slug/);
  assert.match(productClient, /addWishlistItem\(product\.id\)/);
  assert.match(productClient, /removeWishlistItem\(product\.id\)/);
  assert.doesNotMatch(`${shopClient}\n${productGrid}\n${wishlistClient}`, /\/product\/\$\{(?:product|item)\.id\}/);
});

test("product try-on is exposed from the client surface without making slug pages admin-dynamic", () => {
  const productPage = read("app/product/[slug]/page.tsx");
  const productClient = read("components/features/product-client.tsx");

  assert.doesNotMatch(productPage, /requireAdmin|isAdmin|getServerSession/);
  assert.match(productClient, /ProductTryOnWorkspace/);
  assert.match(productClient, /Try it on/);
  assert.equal(existsSync("app/api/products/[id]/try-ons/route.ts"), true);
  assert.equal(existsSync("app/api/products/[productId]/try-ons/route.ts"), false);
});

test("old product UUID URLs are intercepted before page streaming", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /matcher:\s*"\/product\/:slug"/);
  assert.match(proxy, /PRODUCT_UUID_PATTERN/);
  assert.match(proxy, /NextResponse\.redirect\(new URL\(`\/product\/\$\{product\.slug\}`/);
  assert.match(proxy, /,\s*308\)/);
});

test("public product and combo detail pages expose static params", () => {
  const productPage = read("app/product/[slug]/page.tsx");
  const comboPage = read("app/combo/[id]/page.tsx");

  assert.doesNotMatch(productPage, /dynamic = "force-dynamic"/);
  assert.match(productPage, /generateStaticParams/);
  assert.match(productPage, /getActiveProductStaticParams/);
  assert.doesNotMatch(comboPage, /dynamic = "force-dynamic"/);
  assert.match(comboPage, /generateStaticParams/);
  assert.match(comboPage, /getActiveComboStaticParams/);
});

test("footer and menu shells use theme tokens instead of fixed black and white", () => {
  const footer = read("components/layout/footer.tsx");
  const navbar = read("app/navbar.tsx");

  assert.match(footer, /bg-background text-foreground/);
  assert.doesNotMatch(footer, /bg-neutral-950 text-white/);
  assert.match(navbar, /bg-background text-foreground/);
  assert.doesNotMatch(navbar, /bg-neutral-950 text-white/);
});

test("brand protection is a top-level navbar and footer link with a shield icon", () => {
  const navbar = read("app/navbar.tsx");
  const footer = read("components/layout/footer.tsx");

  assert.match(navbar, /href: "\/shop", label: "Shop"/);
  assert.match(navbar, /href="\/brand-protection"/);
  assert.match(navbar, /href="\/account"/);
  assert.match(navbar, /ShieldCheck/);
  assert.match(navbar, /aria-label="Brand Protection"/);
  assert.doesNotMatch(navbar, /CART \[/);
  assert.match(footer, /href: "\/brand-protection", label: "Brand Protection"/);
});

test("non-critical root effects are deferred out of the initial client path", () => {
  const footerGate = read("components/layout/footer-gate.tsx");
  const cursorLoader = read("components/effects/cursor-dot-loader.tsx");

  assert.match(footerGate, /dynamic\(/);
  assert.match(footerGate, /FooterShell/);
  assert.match(cursorLoader, /requestIdleCallback/);
  assert.match(cursorLoader, /pointer: fine/);
  assert.match(cursorLoader, /prefers-reduced-motion: reduce/);
});

test("hero panels avoid layout-shift-prone layout animation", () => {
  const hero = read("components/features/hero.tsx");

  assert.match(hero, /duration: 0\.46/);
  assert.doesNotMatch(hero, /<motion\.div\s+key={slide\.src}[\s\S]*\slayout[\s\S]*role={isActive/);
  assert.doesNotMatch(hero, /className="absolute inset-0"\s+layout/);
});

test("animated nav text and reels expose accessible fallbacks", () => {
  const navbar = read("app/navbar.tsx");
  const reels = read("components/features/shop-the-reels.tsx");

  assert.match(navbar, /<span className="sr-only">{text}<\/span>/);
  assert.doesNotMatch(navbar, /<span aria-label={text}/);
  assert.match(reels, /<track/);
  assert.match(reels, /kind="captions"/);
});

test("mobile reviews are capped to four cards", () => {
  const reviews = read("components/features/real-reviews.tsx");

  assert.match(reviews, /REVIEWS\.map\(\(review, index\)/);
  assert.match(reviews, /index >= 4/);
  assert.match(reviews, /max-md:hidden/);
});

test("shared buttons use circular pill geometry by default", () => {
  const button = read("components/ui/button.tsx");

  assert.match(button, /rounded-full/);
  assert.doesNotMatch(button, /rounded-md text-sm font-medium/);
});

test("wishlist is account-backed and has no localStorage fallback", () => {
  const layout = read("app/layout.tsx");
  const navbar = read("app/navbar.tsx");
  const wishlistPage = read("app/wishlist/page.tsx");
  const productClient = read("components/features/product-client.tsx");

  assert.equal(existsSync("lib/wishlist-context.tsx"), false);
  assert.match(navbar, /getWishlistNavState/);
  assert.match(wishlistPage, /getServerSession/);
  assert.match(wishlistPage, /getWishlistProducts/);
  assert.match(productClient, /getProductWishlist/);
  assert.doesNotMatch(`${layout}\n${navbar}\n${wishlistPage}\n${productClient}`, /xilar-wishlist|useWishlist|WishlistProvider/);
});

test("theme first paint stays static and is repaired before hydration", () => {
  const layout = read("app/layout.tsx");
  const themeContext = read("lib/theme-context.tsx");

  assert.match(layout, /xilar-theme/);
  assert.doesNotMatch(layout, /cookies\(/);
  assert.doesNotMatch(layout, /next\/headers/);
  assert.match(layout, /className="dark"/);
  assert.match(layout, /localStorage\.getItem\('xilar-theme'\)/);
  assert.match(layout, /document\.cookie/);
  assert.match(themeContext, /document\.cookie = `xilar-theme=\$\{theme\}/);
  assert.match(layout, /<html lang="en-BD" className="dark" suppressHydrationWarning>/);
});

test("google analytics tag is installed once at the root layout", () => {
  const layout = read("app/layout.tsx");
  const tagIdMatches = layout.match(/G-6GDBLBWZW9/g) ?? [];

  assert.match(layout, /import Script from "next\/script"/);
  assert.match(layout, /const GOOGLE_TAG_ID = "G-6GDBLBWZW9"/);
  assert.match(layout, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=\$\{GOOGLE_TAG_ID\}/);
  assert.match(layout, /gtag\('config', '\$\{GOOGLE_TAG_ID\}'\)/);
  assert.equal(tagIdMatches.length, 1);
});

test("storefront-only preview pauses checkout, accounts, and backend APIs", () => {
  const couponRoute = read("app/api/coupons/validate/route.ts");
  const checkoutPage = read("app/checkout/page.tsx");
  const accountPage = read("app/account/page.tsx");
  const adminLayout = read("app/admin/layout.tsx");
  const wishlistActions = read("lib/actions/wishlist.ts");

  assert.match(couponRoute, /storefrontUnavailableResponse\("Coupons"\)/);
  assert.match(checkoutPage, /Checkout is paused/);
  assert.match(accountPage, /Accounts are paused/);
  assert.match(adminLayout, /Admin is paused/);
  assert.match(wishlistActions, /STOREFRONT_UNAVAILABLE_MESSAGE/);
  assert.equal(existsSync("components/features/storefront-unavailable.tsx"), true);
  assert.equal(existsSync("data/demo-catalog.json"), true);
});

test("public media has explicit cache policy for repeat visits", () => {
  const nextConfig = read("next.config.ts");

  assert.match(nextConfig, /minimumCacheTTL: 60 \* 60 \* 24 \* 30/);
  assert.match(nextConfig, /"\/hero\/:path\*"/);
  assert.match(nextConfig, /"\/clothes\/:path\*"/);
  assert.match(nextConfig, /stale-while-revalidate=2592000/);
});

test("footer social-style shortcuts keep visitors on the same website", () => {
  const footer = read("components/layout/footer.tsx");
  assert.doesNotMatch(footer, /href={`mailto:|href={`tel:|href={CONTACT_FACEBOOK}/);
  assert.equal((footer.match(/href="\/"\s+title="Beauty Room website"/g) ?? []).length, 3);
});

test("homepage avoids a nearly empty accessories grid", () => {
  const home = read("app/page.tsx");
  assert.match(home, /merchandising\.accessories\.length >= 2/);
  assert.match(home, /viewAllHref="\/shop\/accessories"/);
});

test("uploaded gold logo is used in the main navbar, menu and page metadata", () => {
  const navbar = read("app/navbar.tsx");
  const layout = read("app/layout.tsx");
  const path = "public/branding/beauty-room-gold-logo.webp";
  assert.equal(existsSync(path), true);
  assert.equal((navbar.match(/\/branding\/beauty-room-gold-logo\.webp/g) ?? []).length, 2);
  assert.match(layout, /\/branding\/beauty-room-gold-logo\.webp/);
});

test("brand protection keeps certificate accessible without restoring private facts table", () => {
  const page = read("app/brand-protection/page.tsx");
  assert.match(page, /<CertificateViewer \/>/);
  assert.match(page, /trademark-certificate-title/);
  assert.doesNotMatch(page, /TRADEMARK_FACTS|TRADEMARK\.proprietorAddress/);
});

test("certificate is presented in the first desktop content row and the footer uses the gold logo", () => {
  const page = read("app/brand-protection/page.tsx");
  const footer = read("components/layout/footer.tsx");
  const viewer = read("components/features/certificate-viewer.tsx");

  assert.match(page, /lg:grid-cols-\\[/);
  assert.match(page, /id="trademark-certificate-title"/);
  assert.match(page, /<CertificateViewer \\/>/);
  assert.match(page, /beauty-room-gold-logo\\.webp/);
  assert.match(footer, /src="\\/branding\\/beauty-room-gold-logo\\.webp"/);
  assert.doesNotMatch(footer, /<PixelatedText/);
  assert.match(viewer, /z-\\[110\\]/);
});
