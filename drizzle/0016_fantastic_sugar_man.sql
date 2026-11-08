CREATE TABLE "homepage_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"image_url" text NOT NULL,
	"href" text DEFAULT '/shop' NOT NULL,
	"cta_label" text DEFAULT 'Shop now' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_import_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"file_name" text,
	"status" text DEFAULT 'completed' NOT NULL,
	"imported_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"duplicate_count" integer DEFAULT 0 NOT NULL,
	"skipped_count" integer DEFAULT 0 NOT NULL,
	"report" json DEFAULT '{"imported":[],"failed":[],"duplicates":[],"missing":[]}'::json NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
UPDATE "products" SET "category" = 'accessory' WHERE "category" NOT IN ('skincare', 'makeup', 'haircare', 'fragrance', 'bodycare', 'nailcare', 'tools', 'kits', 'wellness', 'accessory');--> statement-breakpoint
DROP TYPE "public"."product_category";--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('skincare', 'makeup', 'haircare', 'fragrance', 'bodycare', 'nailcare', 'tools', 'kits', 'wellness', 'accessory');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE "public"."product_category" USING "category"::"public"."product_category";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "fabric" TO "ingredients";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "gsm" TO "volume";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "brand" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sku" text;--> statement-breakpoint
ALTER TABLE "product_import_runs" ADD CONSTRAINT "product_import_runs_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_import_runs_created_at_idx" ON "product_import_runs" USING btree ("created_at");