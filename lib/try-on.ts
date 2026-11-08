export const TRY_ON_PROMPT_VERSION = "try-on-v1";
export const DEFAULT_TRY_ON_MODEL_ID = "google/gemini-3.1-flash-image";
export const MAX_TRY_ON_IMAGE_BYTES = 10 * 1024 * 1024;

export const TRY_ON_BODY_MODES = ["upper", "lower", "full"] as const;
export type TryOnBodyMode = (typeof TRY_ON_BODY_MODES)[number];
export type RequiredTryOnMode = "upper" | "lower" | "unsupported";

const TOP_CATEGORIES = new Set(["makeup", "skincare", "fragrance"]);
const BOTTOM_CATEGORIES = new Set(["nailcare", "bodycare"]);
const SUPPORTED_TRY_ON_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function getRequiredTryOnMode(category: string): RequiredTryOnMode {
  if (TOP_CATEGORIES.has(category)) return "upper";
  if (BOTTOM_CATEGORIES.has(category)) return "lower";
  return "unsupported";
}

export function isTryOnBodyMode(value: string | null | undefined): value is TryOnBodyMode {
  return TRY_ON_BODY_MODES.includes(value as TryOnBodyMode);
}

export function isTryOnBodyModeAllowed(
  requiredMode: RequiredTryOnMode,
  bodyMode: TryOnBodyMode,
) {
  if (requiredMode === "unsupported") return false;
  if (bodyMode === "full") return true;
  return requiredMode === bodyMode;
}

export function getTryOnModelId(env?: { OPENROUTER_TRYON_MODEL?: string }) {
  const modelId = env?.OPENROUTER_TRYON_MODEL ?? process.env.OPENROUTER_TRYON_MODEL;
  return modelId?.trim() || DEFAULT_TRY_ON_MODEL_ID;
}

export function validateTryOnImageFile(file: { type: string; size: number }) {
  if (!SUPPORTED_TRY_ON_IMAGE_TYPES.has(file.type)) {
    return { ok: false as const, error: "Upload a JPEG, PNG, or WebP image." };
  }

  if (file.size > MAX_TRY_ON_IMAGE_BYTES) {
    return { ok: false as const, error: "Image must be 10MB or smaller." };
  }

  return { ok: true as const };
}

export function buildTryOnPrompt({
  productName,
  category,
  requiredMode,
}: {
  productName: string;
  category: string;
  requiredMode: RequiredTryOnMode;
}) {
  const targetArea = requiredMode === "lower" ? "hands and nails" : "face and the indicated area";

  return [
    `Create a realistic beauty preview for the product "${productName}" (${category}).`,
    "Use the first reference image as the person photo and the second reference image as the product reference.",
    "Preserve the person, face, pose, camera angle, lighting direction, and background from the photo.",
    `Apply only the selected beauty product to the ${targetArea}, matching color, finish, and texture as faithfully as possible.`,
    "Keep skin tone, hair, clothing, and background unchanged unless naturally covered by the product.",
    "Do not invent extra logos, ingredients, claims, or product details.",
  ].join(" ");
}

export function buildTryOnAssetPublicId({
  productId,
  userId,
  timestamp,
  kind,
}: {
  productId: string;
  userId: string;
  timestamp: number;
  kind: "body" | "output";
}) {
  return `${productId}-${userId}-${timestamp}-${kind}`
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}
