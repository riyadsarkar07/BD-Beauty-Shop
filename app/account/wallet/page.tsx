import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { getWalletForUser } from "@/lib/wallet";
import { StorefrontUnavailable } from "@/components/features/storefront-unavailable";
import { isStorefrontOnly } from "@/lib/storefront-mode";
import { WalletClient } from "./wallet-client";

export const metadata: Metadata = { title: "Wallet | BD Beauty", robots: { index: false, follow: false } };

export default async function WalletPage() {
  if (isStorefrontOnly()) {
    return <StorefrontUnavailable title="Wallet is paused" />;
  }

  const session = await getServerSession();
  if (!session) redirect("/account?redirect=/account/wallet");
  const wallet = await getWalletForUser(session.user.id);
  return <WalletClient initialWallet={wallet} />;
}
