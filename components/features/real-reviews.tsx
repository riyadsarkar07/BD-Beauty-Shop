import { CheckCircle2, Star } from "lucide-react"

const REVIEWS = [
    {
        title: "My skin finally feels calm",
        body: "Ordered the cleanser and moisturizer together. Delivery reached Narsingdi in two days and the packaging was intact.",
        name: "Farhana A.",
        product: "Daily Skincare Set",
    },
    {
        title: "Worth every taka",
        body: "Was unsure about ordering beauty products online, but the product was exactly as described and the price was fair.",
        name: "Nusrat J.",
        product: "Hydrating Serum",
    },
    {
        title: "My go-to shop now",
        body: "Third order this year. Cash on delivery makes it easy and the WhatsApp support replies quickly.",
        name: "Tania R.",
        product: "Everyday Makeup Kit",
    },
    {
        title: "Shade matched perfectly",
        body: "The shade description was accurate and it stayed on through a full day. Will order again.",
        name: "Sadia K.",
        product: "Matte Lip Color",
    },
    {
        title: "Fast delivery, careful packing",
        body: "Ordered at night, received it across Dhaka in a couple of days. Nothing was damaged.",
        name: "Rumana H.",
        product: "Body Care Duo",
    },
    {
        title: "Compliments every single time",
        body: "The fragrance lasts longer than I expected. Friends keep asking which one it is.",
        name: "Mehjabin P.",
        product: "Signature Fragrance",
    },
]

export function RealReviews() {
    return (
        <section className="border-t border-border/60 bg-secondary/20 px-6 py-16 md:px-12 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 md:mb-12 text-center">
                    <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
                        Sample reviews
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">What Our Customers Say</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {REVIEWS.map((review, index) => (
                        <article key={`${review.name}-${review.product}`} className={`border border-border/70 bg-background/55 p-5 md:p-6 ${index >= 4 ? "max-md:hidden" : ""}`}>
                            <div className="mb-4 flex items-center gap-1 text-[#caa45d]" aria-label="5 out of 5 stars">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <h3 className="text-sm font-bold tracking-wide">{review.title}</h3>
                            <p className="mt-4 min-h-[4rem] text-sm leading-7 text-muted-foreground">{review.body}</p>
                            <div className="mt-5 border-t border-border/70 pt-4">
                                <p className="text-sm font-bold">{review.name}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{review.product}</p>
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Verified Buyer
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
