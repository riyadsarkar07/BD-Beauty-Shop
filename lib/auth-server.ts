import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isStorefrontOnly } from "@/lib/storefront-mode";

export async function getServerSession() {
  if (isStorefrontOnly() || !auth) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function isAdmin() {
  const session = await getServerSession();
  return session?.user?.role === "admin";
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }
  return session;
}
