"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchArtwork() {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        toast.error("Artwork not found");
      } else {
        setArtwork(data);
      }
      setLoading(false);
    }
    fetchArtwork();
  }, [slug]);

  const addToCart = () => {
    // Basic cart logic using localStorage for MVP
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === artwork.id);

    if (existingItem) {
      toast.info("Item already in cart");
    } else {
      cart.push({
        id: artwork.id,
        title: artwork.title,
        price: artwork.price,
        image: artwork.images[0],
        slug: artwork.slug,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart");
      // Dispatch event to update navbar cart count if needed
      window.dispatchEvent(new Event("storage"));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Artwork not found</h1>
          <Button asChild variant="outline">
            <Link href="/">Back to Gallery</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto flex-1 max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="gap-2 text-muted-foreground"
          >
            <Link href="/">
              <ChevronLeft className="h-4 w-4" /> Back to Gallery
            </Link>
          </Button>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={artwork.images[currentImageIndex]}
                  alt={artwork.title}
                  className="h-full w-full object-contain"
                />
              </AnimatePresence>

              {artwork.images.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? artwork.images.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === artwork.images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            {artwork.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {artwork.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                      currentImageIndex === idx
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {artwork.video_url && (
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-bold">Watch Video</h3>
                <div className="aspect-video overflow-hidden rounded-xl border border-border">
                  <iframe
                    src={artwork.video_url.replace("watch?v=", "embed/")}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  {artwork.title}
                </h1>
                <Badge
                  variant={
                    artwork.status === "available" ? "default" : "secondary"
                  }
                >
                  {artwork.status}
                </Badge>
              </div>
              <p className="text-2xl font-semibold text-foreground">
                Rs. {Number(artwork.price).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-y border-border py-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Medium</span>
                  <p className="font-medium">{artwork.medium || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dimensions</span>
                  <p className="font-medium">{artwork.dimensions || "N/A"}</p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Inventory</span>
                <p className="font-medium">{artwork.inventory} available</p>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Original (unframed). Shipping within Pakistan only.
              </p>
            </div>

            <div className="prose prose-primary max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {artwork.description || "No description available."}
              </p>
            </div>

            <div className="mt-auto pt-8">
              <Button
                size="lg"
                className="w-full text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={addToCart}
                disabled={artwork.status !== "available"}
              >
                {artwork.status === "available" ? "Add to Cart" : "Sold Out"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
