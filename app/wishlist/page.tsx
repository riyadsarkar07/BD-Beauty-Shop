import { WishlistClient } from "@/components/features/wishlist-client";
import { StorefrontUnavailable } from "@/components/features/storefront-unavailable";
import { getServerSession } from "@/lib/auth-server";
import { isStorefrontOnly } from "@/lib/storefront-mode";
import { getWishlistProducts } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  if (isStorefrontOnly()) {
    return (
      <StorefrontUnavailable
        title="Wishlist is paused"
        description="Saved items need an account backend. Browse the catalog for now; wishlist returns when authentication is connected."
      />
    );
  }

  const session = await getServerSession();
  const initialItems = session?.user?.id
    ? await getWishlistProducts(session.user.id)
    : [];

  return (
    <WishlistClient
      initialAuthenticated={Boolean(session?.user?.id)}
      initialItems={initialItems}
    />
  );
}
