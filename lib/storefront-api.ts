import { NextResponse } from "next/server";
import { storefrontUnavailablePayload } from "@/lib/storefront-mode";

export function storefrontUnavailableResponse(feature?: string, status = 503) {
  return NextResponse.json(storefrontUnavailablePayload(feature), { status });
}
