import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ShippingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />
      <main className="mx-auto flex-1 max-w-3xl px-4 py-20 md:px-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Shipping & Returns
        </h1>

        <div className="mt-12 space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Shipping Within Pakistan</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We offer free shipping on all original artworks within Pakistan.
              Orders are typically processed within 2-3 business days and
              delivered within 5-7 business days via reliable local couriers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">International Shipping</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              At launch, we are only shipping within Pakistan. For international
              inquiries, please contact us directly at{" "}
              <strong>info@artistname.com</strong> to discuss custom shipping
              arrangements and rates.
            </p>
            <p className="text-sm italic text-zinc-500">
              Note: International buyers are responsible for any customs duties
              or import taxes that may apply.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Packaging & Framing</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              All artworks are sold <strong>unframed</strong> unless explicitly
              stated otherwise. They are carefully rolled in heavy-duty tubes or
              packed flat in reinforced envelopes to ensure they reach you in
              perfect condition.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Returns & Refunds</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              As these are original, one-of-a-kind artworks, all sales are
              final. However, if your artwork arrives damaged, please contact us
              within 48 hours of delivery with photos of the damage and the
              packaging to arrange for a resolution.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
