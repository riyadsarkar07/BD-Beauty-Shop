import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import { sendResetPasswordEmail } from "./email";
import { isStorefrontOnly } from "./storefront-mode";

const authBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.BETTER_AUTH_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const authSecret = process.env.BETTER_AUTH_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const hasGoogleOAuth = Boolean(googleClientId && googleClientSecret);

function createAuth() {
  if (isStorefrontOnly() || !authSecret || !process.env.DATABASE_URL) {
    return null;
  }

  return betterAuth({
    baseURL: authBaseUrl,
    secret: authSecret,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      sendResetPassword: async ({ user, url }) => {
        try {
          await sendResetPasswordEmail(user, url);
        } catch {
          throw new Error("Failed to send password reset email");
        }
      },
    },

    socialProviders: hasGoogleOAuth
      ? {
          google: {
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
          },
        }
      : {},

    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: hasGoogleOAuth ? ["email-password", "google"] : ["email-password"],
        updateUserInfoOnLink: true,
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        },
        phone: {
          type: "string",
          required: false,
        },
      },
    },

    plugins: [
      admin({
        defaultRole: "user",
        adminRole: "admin",
      }),
    ],

    trustedOrigins: ["http://localhost:3000", authBaseUrl].filter(Boolean),
  });
}

export const auth = createAuth();

export type Session = NonNullable<typeof auth> extends { $Infer: { Session: infer T } } ? T : never;
export type User = Session extends { user: infer T } ? T : never;
