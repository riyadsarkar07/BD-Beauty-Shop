import {
  DHAKA_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  OUTSIDE_DHAKA_SHIPPING_FEE,
} from "./constants.ts"

export type BangladeshDistrict = {
  name: string
  bn: string
  division: string
  isDhakaMetro: boolean
}

export const BANGLADESH_DISTRICTS: BangladeshDistrict[] = [
  { name: "Dhaka", bn: "ঢাকা", division: "Dhaka", isDhakaMetro: true },
  { name: "Gazipur", bn: "গাজীপুর", division: "Dhaka", isDhakaMetro: true },
  { name: "Narayanganj", bn: "নারায়ণগঞ্জ", division: "Dhaka", isDhakaMetro: true },
  { name: "Narsingdi", bn: "নরসিংদী", division: "Dhaka", isDhakaMetro: false },
  { name: "Tangail", bn: "টাঙ্গাইল", division: "Dhaka", isDhakaMetro: false },
  { name: "Kishoreganj", bn: "কিশোরগঞ্জ", division: "Dhaka", isDhakaMetro: false },
  { name: "Manikganj", bn: "মানিকগঞ্জ", division: "Dhaka", isDhakaMetro: false },
  { name: "Munshiganj", bn: "মুন্সিগঞ্জ", division: "Dhaka", isDhakaMetro: false },
  { name: "Faridpur", bn: "ফরিদপুর", division: "Dhaka", isDhakaMetro: false },
  { name: "Madaripur", bn: "মাদারীপুর", division: "Dhaka", isDhakaMetro: false },
  { name: "Shariatpur", bn: "শরীয়তপুর", division: "Dhaka", isDhakaMetro: false },
  { name: "Rajbari", bn: "রাজবাড়ী", division: "Dhaka", isDhakaMetro: false },
  { name: "Gopalganj", bn: "গোপালগঞ্জ", division: "Dhaka", isDhakaMetro: false },
  { name: "Chattogram", bn: "চট্টগ্রাম", division: "Chattogram", isDhakaMetro: false },
  { name: "Cox's Bazar", bn: "কক্সবাজার", division: "Chattogram", isDhakaMetro: false },
  { name: "Cumilla", bn: "কুমিল্লা", division: "Chattogram", isDhakaMetro: false },
  { name: "Feni", bn: "ফেনী", division: "Chattogram", isDhakaMetro: false },
  { name: "Noakhali", bn: "নোয়াখালী", division: "Chattogram", isDhakaMetro: false },
  { name: "Lakshmipur", bn: "লক্ষ্মীপুর", division: "Chattogram", isDhakaMetro: false },
  { name: "Chandpur", bn: "চাঁদপুর", division: "Chattogram", isDhakaMetro: false },
  { name: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", division: "Chattogram", isDhakaMetro: false },
  { name: "Rangamati", bn: "রাঙ্গামাটি", division: "Chattogram", isDhakaMetro: false },
  { name: "Khagrachhari", bn: "খাগড়াছড়ি", division: "Chattogram", isDhakaMetro: false },
  { name: "Bandarban", bn: "বান্দরবান", division: "Chattogram", isDhakaMetro: false },
  { name: "Sylhet", bn: "সিলেট", division: "Sylhet", isDhakaMetro: false },
  { name: "Moulvibazar", bn: "মৌলভীবাজার", division: "Sylhet", isDhakaMetro: false },
  { name: "Habiganj", bn: "হবিগঞ্জ", division: "Sylhet", isDhakaMetro: false },
  { name: "Sunamganj", bn: "সুনামগঞ্জ", division: "Sylhet", isDhakaMetro: false },
  { name: "Rajshahi", bn: "রাজশাহী", division: "Rajshahi", isDhakaMetro: false },
  { name: "Bogura", bn: "বগুড়া", division: "Rajshahi", isDhakaMetro: false },
  { name: "Pabna", bn: "পাবনা", division: "Rajshahi", isDhakaMetro: false },
  { name: "Sirajganj", bn: "সিরাজগঞ্জ", division: "Rajshahi", isDhakaMetro: false },
  { name: "Natore", bn: "নাটোর", division: "Rajshahi", isDhakaMetro: false },
  { name: "Naogaon", bn: "নওগাঁ", division: "Rajshahi", isDhakaMetro: false },
  { name: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ", division: "Rajshahi", isDhakaMetro: false },
  { name: "Joypurhat", bn: "জয়পুরহাট", division: "Rajshahi", isDhakaMetro: false },
  { name: "Khulna", bn: "খুলনা", division: "Khulna", isDhakaMetro: false },
  { name: "Jessore", bn: "যশোর", division: "Khulna", isDhakaMetro: false },
  { name: "Jhenaidah", bn: "ঝিনাইদহ", division: "Khulna", isDhakaMetro: false },
  { name: "Magura", bn: "মাগুরা", division: "Khulna", isDhakaMetro: false },
  { name: "Narail", bn: "নড়াইল", division: "Khulna", isDhakaMetro: false },
  { name: "Kushtia", bn: "কুষ্টিয়া", division: "Khulna", isDhakaMetro: false },
  { name: "Meherpur", bn: "মেহেরপুর", division: "Khulna", isDhakaMetro: false },
  { name: "Chuadanga", bn: "চুয়াডাঙ্গা", division: "Khulna", isDhakaMetro: false },
  { name: "Satkhira", bn: "সাতক্ষীরা", division: "Khulna", isDhakaMetro: false },
  { name: "Bagerhat", bn: "বাগেরহাট", division: "Khulna", isDhakaMetro: false },
  { name: "Barishal", bn: "বরিশাল", division: "Barishal", isDhakaMetro: false },
  { name: "Bhola", bn: "ভোলা", division: "Barishal", isDhakaMetro: false },
  { name: "Patuakhali", bn: "পটুয়াখালী", division: "Barishal", isDhakaMetro: false },
  { name: "Pirojpur", bn: "পিরোজপুর", division: "Barishal", isDhakaMetro: false },
  { name: "Jhalokathi", bn: "ঝালকাঠি", division: "Barishal", isDhakaMetro: false },
  { name: "Barguna", bn: "বরগুনা", division: "Barishal", isDhakaMetro: false },
  { name: "Rangpur", bn: "রংপুর", division: "Rangpur", isDhakaMetro: false },
  { name: "Dinajpur", bn: "দিনাজপুর", division: "Rangpur", isDhakaMetro: false },
  { name: "Kurigram", bn: "কুড়িগ্রাম", division: "Rangpur", isDhakaMetro: false },
  { name: "Gaibandha", bn: "গাইবান্ধা", division: "Rangpur", isDhakaMetro: false },
  { name: "Lalmonirhat", bn: "লালমনিরহাট", division: "Rangpur", isDhakaMetro: false },
  { name: "Nilphamari", bn: "নীলফামারী", division: "Rangpur", isDhakaMetro: false },
  { name: "Panchagarh", bn: "পঞ্চগড়", division: "Rangpur", isDhakaMetro: false },
  { name: "Thakurgaon", bn: "ঠাকুরগাঁও", division: "Rangpur", isDhakaMetro: false },
  { name: "Mymensingh", bn: "ময়মনসিংহ", division: "Mymensingh", isDhakaMetro: false },
  { name: "Jamalpur", bn: "জামালপুর", division: "Mymensingh", isDhakaMetro: false },
  { name: "Netrokona", bn: "নেত্রকোণা", division: "Mymensingh", isDhakaMetro: false },
  { name: "Sherpur", bn: "শেরপুর", division: "Mymensingh", isDhakaMetro: false },
]

const DISTRICT_LOOKUP = new Map(BANGLADESH_DISTRICTS.map((district) => [district.name.toLowerCase(), district]))

export function findBangladeshDistrict(name?: string | null) {
  if (!name) return null
  return DISTRICT_LOOKUP.get(name.trim().toLowerCase()) ?? null
}

export function isDhakaMetroDistrict(name?: string | null) {
  return findBangladeshDistrict(name)?.isDhakaMetro === true
}

export function getDeliveryCharge(districtName: string | null | undefined, subtotal: number) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return isDhakaMetroDistrict(districtName) ? DHAKA_SHIPPING_FEE : OUTSIDE_DHAKA_SHIPPING_FEE
}

const BD_PHONE_PATTERN = /^(?:\+?8801|01)[3-9]\d{8}$/

export function normalizeBangladeshPhone(value: string) {
  const digits = value.replace(/[^\d+]/g, "")
  if (digits.startsWith("+880")) return `+${digits.replace(/^\+/, "")}`
  if (digits.startsWith("880")) return `+${digits}`
  if (digits.startsWith("01")) return `+880${digits.slice(1)}`
  return digits
}

export function isValidBangladeshPhone(value: string) {
  const compact = value.replace(/[\s-]/g, "")
  return BD_PHONE_PATTERN.test(compact)
}

export function isValidBangladeshPostalCode(value: string) {
  return /^\d{4}$/.test(value.trim())
}

export function whatsappHref(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/8801324180055${text}`
}
