"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  Upload,
  CreditCard,
  Smartphone,
} from "lucide-react";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "bank_transfer",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (savedCart.length === 0 && !orderId) {
      router.push("/");
    }
    setCart(savedCart);
  }, [orderId, router]);

  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      toast.error("Please upload payment receipt screenshot");
      return;
    }
    setLoading(true);

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            buyer_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            shipping_address: formData.address,
            city: formData.city,
            total: total,
            payment_method: formData.paymentMethod,
            payment_status: "pending",
            order_status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Upload Payment Proof
      let paymentProofUrl = "";
      if (proofFile) {
        const fileExt = proofFile.name.split(".").pop();
        const fileName = `${order.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("proofs")
          .upload(fileName, proofFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("proofs").getPublicUrl(fileName);

        paymentProofUrl = publicUrl;

        // Update order with proof URL
        await supabase
          .from("orders")
          .update({ payment_proof_url: paymentProofUrl })
          .eq("id", order.id);
      }

      // 3. Create Order Items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        artwork_id: item.id,
        price: item.price,
        quantity: 1,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Clear Cart
      const finalTotal = total;
      localStorage.setItem("cart", "[]");
      setOrderTotal(finalTotal);
      setOrderId(order.id);
      toast.success("Order placed successfully!");
      window.dispatchEvent(new Event("storage"));
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-black">
        <Navbar />
        <main className="mx-auto flex flex-1 w-full max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/20">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Confirmed!
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            Thank you for your purchase. Your order ID is{" "}
            <span className="font-mono font-bold text-black dark:text-white">
              #{orderId.slice(0, 8)}
            </span>
          </p>

          <div className="mt-12 w-full space-y-6">
            <Card className="border-green-100 bg-green-50/30 dark:border-green-900/30 dark:bg-green-900/10">
              <CardContent className="pt-6">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Your payment receipt for{" "}
                  <strong>Rs. {orderTotal.toLocaleString()}</strong> has been
                  uploaded successfully. Our team will verify the payment and
                  process your order shortly.
                </p>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
              <p className="text-sm font-medium text-zinc-500">
                Need Assistance?
              </p>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                If any problem occurs or you have questions about your order,
                please contact us at:
              </p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-black dark:text-white">
                +92 332 5123174
              </p>
            </div>
          </div>

          <Button asChild className="mt-12" size="lg">
            <Link href="/">Back to Gallery</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Navbar />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-12 md:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Shipping Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+92 300 0000000"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value="Pakistan"
                    disabled
                    className="bg-zinc-100"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Currently shipping within Pakistan only.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <div className="grid gap-4">
                {[
                  // {
                  //   id: "bank_transfer",
                  //   name: "Bank Transfer",
                  //   desc: "Pay via Bank App/ATM",
                  //   icon: CreditCard,
                  //   details:
                  //     "Meezan Bank | Iffat Samina | IBAN: PK00MEZN0000000000000000",
                  // },
                  {
                    id: "easypaisa",
                    name: "Easypaisa",
                    desc: "Pay via Easypaisa App",
                    icon: Smartphone,
                    details: "Easypaisa: +92 3325123174 | Iffat Samina",
                  },
                  // {
                  //   id: "jazzcash",
                  //   name: "JazzCash",
                  //   desc: "Pay via JazzCash App",
                  //   icon: Smartphone,
                  //   details: "JazzCash: 0300 0000000 | Iffat Samina",
                  // },
                ].map((method) => (
                  <div
                    key={method.id}
                    className={`flex flex-col rounded-xl border-2 p-4 transition-colors ${
                      formData.paymentMethod === method.id
                        ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="payment"
                          className="h-4 w-4"
                          checked={formData.paymentMethod === method.id}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              paymentMethod: method.id,
                            })
                          }
                        />
                        <div className="flex items-center gap-2">
                          <method.icon className="h-5 w-5" />
                          <div>
                            <p className="font-semibold">{method.name}</p>
                            <p className="text-xs text-zinc-500">
                              {method.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                    {formData.paymentMethod === method.id && (
                      <div className="mt-4 rounded-lg bg-white p-3 text-xs dark:bg-black border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-1">
                        <p className="font-mono text-black dark:text-white leading-relaxed">
                          {method.details}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Upload Payment Receipt</h2>
              <Card className="border-dashed border-2">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-900">
                      <Upload className="h-6 w-6 text-zinc-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        Click to upload screenshot
                      </p>
                      <p className="text-xs text-zinc-500">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProofFile(file);
                      }}
                    />
                    {proofFile && (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ {proofFile.name} selected
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-zinc-500">{item.title}</span>
                    <span className="font-medium">
                      Rs. {Number(item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-4 w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing
                      Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
                <p className="text-center text-[10px] text-zinc-500">
                  By clicking Place Order, you agree to make the manual payment
                  as described after checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
