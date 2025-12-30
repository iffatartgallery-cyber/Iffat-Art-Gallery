"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Loader2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtworks() {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (!error) setArtworks(data || []);
      setLoading(false);
    }
    fetchArtworks();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 px-4 py-12 md:px-8 lg:px-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Portfolio
          </h1>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground">
            A collection of original drawings and artwork.
          </p>
        </header>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No artworks found.</p>
          </div>
        ) : (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4, 1200: 5 }}
          >
            <Masonry gutter="24px">
              {artworks.map((artwork, idx) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-lg bg-secondary"
                >
                  <Link href={`/artwork/${artwork.slug}`}>
                    <div className="aspect-auto overflow-hidden">
                      <img
                        src={artwork.images[0]}
                        alt={artwork.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <h3 className="text-lg font-semibold text-white">
                        {artwork.title}
                      </h3>
                      <p className="text-sm text-zinc-200">
                        Rs. {Number(artwork.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </main>

      <Footer />
    </div>
  );
}
