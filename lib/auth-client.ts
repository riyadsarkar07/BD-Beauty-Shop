import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { isStorefrontOnly, STOREFRONT_UNAVAILABLE_MESSAGE } from "@/lib/storefront-mode";

const liveAuthClient = isStorefrontOnly()
  ? null
  : createAuthClient({
      baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      plugins: [adminClient()],
    });

function unavailableResult() {
  return Promise.resolve({
    error: { message: STOREFRONT_UNAVAILABLE_MESSAGE },
    data: null,
  });
}

export const authClient = liveAuthClient ?? {
  requestPasswordReset: unavailableResult,
  resetPassword: unavailableResult,
};

export const signIn = liveAuthClient?.signIn ?? {
  email: unavailableResult,
  social: unavailableResult,
};

export const signUp = liveAuthClient?.signUp ?? {
  email: unavailableResult,
};

export const signOut = liveAuthClient?.signOut ?? unavailableResult;

export const useSession = liveAuthClient?.useSession ?? function useStorefrontSession() {
  return {
    data: null,
    isPending: false,
    error: null,
    refetch: () => Promise.resolve({ data: null }),
  };
};

export const getSession = liveAuthClient?.getSession ?? unavailableResult;
