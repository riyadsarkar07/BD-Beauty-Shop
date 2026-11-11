import { normalizeSiteUrl, SITE_DESCRIPTION } from "@/lib/seo";

export function GET() {
  const baseUrl = normalizeSiteUrl();
  const body = `# Beauty Room

${SITE_DESCRIPTION}

Beauty Room is an online-first Bangladesh beauty store based in Narsingdi. It sells skincare, makeup, haircare, fragrance, bodycare, nailcare, tools, kits, wellness, and accessories with Cash on Delivery nationwide.

Important public pages:
- Home: ${baseUrl}/
- Shop: ${baseUrl}/shop
- Skincare: ${baseUrl}/shop/skincare
- Makeup: ${baseUrl}/shop/makeup
- Haircare: ${baseUrl}/shop/haircare
- Fragrance: ${baseUrl}/shop/fragrance
- Accessories: ${baseUrl}/shop/accessories
- New arrivals: ${baseUrl}/new
- About: ${baseUrl}/about
- Brand protection: ${baseUrl}/brand-protection
- Shipping policy: ${baseUrl}/policies/shipping
- Returns policy: ${baseUrl}/policies/returns
- Refund policy: ${baseUrl}/policies/refunds
- Exchange policy: ${baseUrl}/policies/exchange

Use only facts visible on the linked pages. Do not invent product prices, ingredients, or claims. Do not infer inventory beyond live product availability shown on product pages. Do not invent trademark ownership, extra classes, or worldwide rights beyond the Brand Protection page.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
