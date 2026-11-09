"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { STOREFRONT_UNAVAILABLE_MESSAGE } from "@/lib/storefront-mode";

export function StorefrontUnavailable({
  title,
  description = STOREFRONT_UNAVAILABLE_MESSAGE,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">Preview</p>
        <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        <Link href="/shop">
          <Button variant="outline" className="rounded-none h-11 text-[10px] uppercase tracking-[0.2em]">
            Continue shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
