import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { isStorefrontOnly } from "@/lib/storefront-mode";
import { storefrontUnavailableResponse } from "@/lib/storefront-api";

function authHandlers() {
  if (isStorefrontOnly() || !auth) {
    const unavailable = () => storefrontUnavailableResponse("Authentication");
    return { GET: unavailable, POST: unavailable };
  }

  return toNextJsHandler(auth);
}

export const { GET, POST } = authHandlers();

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
