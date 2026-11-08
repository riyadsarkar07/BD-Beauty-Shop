import { CURRENCY_CODE, CURRENCY_SYMBOL } from "./constants.ts"

const BD_LOCALE = "en-BD"

export function formatMoney(value: string | number, options?: { withCode?: boolean }) {
  const amount = typeof value === "number" ? value : Number(value)
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const formatted = `${CURRENCY_SYMBOL}${safeAmount.toLocaleString(BD_LOCALE)}`
  return options?.withCode ? `${formatted} ${CURRENCY_CODE}` : formatted
}

export function moneySymbol() {
  return CURRENCY_SYMBOL
}
