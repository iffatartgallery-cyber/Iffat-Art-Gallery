import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              IFFAT<span className="text-primary">SAMINA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Original drawings and artwork by Iffat Samina. Shipping
              exclusively within Pakistan.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About the Artist
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Email: iffatsamina@gmail.com</li>
              <li>Instagram: @saminaiffat_18</li>
            </ul>
          </div>
        </div>
        <div
          className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground"
          suppressHydrationWarning
        >
          © {new Date().getFullYear()} Iffat Samina. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
