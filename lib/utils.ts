import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isThenable<T>(value: T | Promise<T> | null | undefined): value is Promise<T> {
  return typeof (value as { then?: unknown } | null | undefined)?.then === "function"
}

export function generateSecureCode(prefix: string, length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = prefix;
  const randomValues = new Uint32Array(length);
  globalThis.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    code += chars.charAt(randomValues[i] % chars.length);
  }
  return code;
}
