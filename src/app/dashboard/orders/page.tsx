"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, artworks(*))")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({
        order_status: status,
        payment_status:
          status === "paid" || status === "shipped" ? "paid" : "pending",
      })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Order marked as ${status}`);

      // If marked as shipped/paid, check and mark artworks as sold
      if (status === "shipped" || status === "paid") {
        const order = orders.find((o) => o.id === orderId);
        if (order) {
          for (const item of order.order_items) {
            if (item.artworks && item.artworks.inventory === 1) {
              await supabase
                .from("artworks")
                .update({ status: "sold" })
                .eq("id", item.artwork_id);
            }
          }
        }
      }

      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage customer orders and payment proofs.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.buyer_name}</span>
                      <span className="text-xs text-zinc-500">
                        {order.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    Rs. {Number(order.total).toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">
                    {order.payment_method.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.order_status === "shipped"
                          ? "default"
                          : order.order_status === "paid"
                          ? "secondary"
                          : order.order_status === "pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {order.order_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, "paid")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />{" "}
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                        >
                          <Truck className="mr-2 h-4 w-4 text-blue-500" /> Mark
                          as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateOrderStatus(order.id, "cancelled")
                          }
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Order Details #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2 text-sm">
                  <h3 className="font-bold">Customer Info</h3>
                  <p>{selectedOrder.buyer_name}</p>
                  <p>{selectedOrder.email}</p>
                  <p>{selectedOrder.phone}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <h3 className="font-bold">Shipping Address</h3>
                  <p className="whitespace-pre-wrap">
                    {selectedOrder.shipping_address}
                  </p>
                  <p>{selectedOrder.city}, Pakistan</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm">Items</h3>
                <div className="rounded-md border border-zinc-100 dark:border-zinc-800">
                  {selectedOrder.order_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-zinc-100 overflow-hidden dark:bg-zinc-900">
                          {item.artworks?.images?.[0] && (
                            <img
                              src={item.artworks.images[0]}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {item.artworks?.title || "Deleted Artwork"}
                        </span>
                      </div>
                      <span className="text-sm">
                        Rs. {Number(item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-900">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">
                      Rs. {Number(selectedOrder.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Payment Method
                    </p>
                    <p className="mt-1 font-medium capitalize">
                      {selectedOrder.payment_method.replace("_", " ")}
                    </p>
                  </div>
                  {selectedOrder.payment_proof_url && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={selectedOrder.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Receipt
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {selectedOrder.payment_proof_url && (
                <div className="space-y-2">
                  <h3 className="font-bold text-sm">Payment Receipt</h3>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <img
                      src={selectedOrder.payment_proof_url}
                      alt="Payment Proof"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
