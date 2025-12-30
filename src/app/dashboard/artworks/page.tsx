"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  ExternalLink,
  Image as ImageIcon,
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
import Link from "next/link";
import { toast } from "sonner";
import { ArtworkForm } from "@/components/dashboard/artwork-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<any>(null);

  const fetchArtworks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch artworks");
    } else {
      setArtworks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete artwork");
    } else {
      toast.success("Artwork deleted");
      fetchArtworks();
    }
  };

  const filteredArtworks = artworks.filter((artwork) =>
    artwork.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Artworks</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your art collection and gallery.
          </p>
        </div>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingArtwork(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArtwork ? "Edit Artwork" : "Add New Artwork"}
              </DialogTitle>
            </DialogHeader>
            <ArtworkForm
              initialData={editingArtwork}
              onSuccess={() => {
                setIsFormOpen(false);
                fetchArtworks();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search artworks..."
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
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading artworks...
                </TableCell>
              </TableRow>
            ) : filteredArtworks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No artworks found.
                </TableCell>
              </TableRow>
            ) : (
              filteredArtworks.map((artwork) => (
                <TableRow key={artwork.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                      {artwork.images?.[0] ? (
                        <img
                          src={artwork.images[0]}
                          alt={artwork.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                          <ImageIcon className="h-6 w-6 text-zinc-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{artwork.title}</TableCell>
                  <TableCell>
                    Rs. {Number(artwork.price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        artwork.status === "available"
                          ? "default"
                          : artwork.status === "sold"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {artwork.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {new Date(artwork.created_at).toLocaleDateString()}
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
                          onClick={() => {
                            setEditingArtwork(artwork);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/artwork/${artwork.slug}`}
                            target="_blank"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> View Live
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(artwork.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
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
    </div>
  );
}
