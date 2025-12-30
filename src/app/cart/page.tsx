"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    setLoading(false);
  }, []);

  const removeFromCart = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
    toast.success("Item removed");
  };

  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  if (loading) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 py-12 md:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
            <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-900">
              <ShoppingBag className="h-12 w-12 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="text-zinc-500">
                Looks like you haven't added anything yet.
              </p>
            </div>
            <Button asChild>
              <Link href="/">Browse Gallery</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-zinc-100 dark:border-zinc-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{item.title}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-zinc-500">Original Artwork</p>
                      <p className="font-semibold">
                        Rs. {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">
                      Free (Within Pakistan)
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 pt-2 mt-2 dark:border-zinc-800">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full" size="lg">
                  <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-center text-xs text-zinc-500">
                By proceeding, you agree to our{" "}
                <Link href="/shipping" className="underline">
                  Shipping & Returns
                </Link>{" "}
                policies.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
