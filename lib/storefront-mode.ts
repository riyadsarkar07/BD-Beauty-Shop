export const STOREFRONT_UNAVAILABLE_MESSAGE =
  "This public preview is storefront-only. Accounts, checkout, payments, orders, and admin will return when the live backend is connected.";

export function isStorefrontOnly() {
  return process.env.NEXT_PUBLIC_STOREFRONT_ONLY !== "false";
}

export function storefrontUnavailablePayload(feature?: string) {
  return {
    error: feature
      ? `${feature} is not available in this storefront preview.`
      : STOREFRONT_UNAVAILABLE_MESSAGE,
    storefrontOnly: true as const,
  };
}
