import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema.ts";
import { isStorefrontOnly } from "../storefront-mode.ts";

type AppDb = ReturnType<typeof drizzle<typeof schema, Pool>>;

const DATABASE_UNAVAILABLE_MESSAGE =
  "Database is not available in storefront-only mode. Set NEXT_PUBLIC_STOREFRONT_ONLY=false and DATABASE_URL to enable the live backend.";

function createDb(): AppDb {
  const connectionString = process.env.DATABASE_URL;

  if (isStorefrontOnly() || !connectionString) {
    return new Proxy({} as AppDb, {
      get(_target, prop) {
        if (prop === "then") return undefined;
        throw new Error(DATABASE_UNAVAILABLE_MESSAGE);
      },
    });
  }

  const pool = new Pool({ connectionString });
  return drizzle(pool, { schema });
}

export const db = createDb();

export * from "./schema.ts";
