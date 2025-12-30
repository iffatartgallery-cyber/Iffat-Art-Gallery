"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

const artworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  dimensions: z.string().optional(),
  medium: z.string().optional(),
  video_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["available", "sold", "hidden"]),
  inventory: z.number().int().min(0),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

interface ArtworkFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function ArtworkForm({ initialData, onSuccess }: ArtworkFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      dimensions: initialData?.dimensions || "",
      medium: initialData?.medium || "",
      video_url: initialData?.video_url || "",
      status: initialData?.status || "available",
      inventory: initialData?.inventory || 1,
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const newImages = [...images];

      for (const file of acceptedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `artworks/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("artworks")
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Error uploading image: ${uploadError.message}`);
          continue;
        }

        const { data } = supabase.storage
          .from("artworks")
          .getPublicUrl(filePath);
        newImages.push(data.publicUrl);
      }

      setImages(newImages);
      setUploading(false);
    },
    [images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ArtworkFormValues) => {
    setLoading(true);
    const slug = values.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    const artworkData = {
      ...values,
      price: parseFloat(values.price),
      slug,
      images,
    };

    let error;
    if (initialData) {
      const { error: updateError } = await supabase
        .from("artworks")
        .update(artworkData)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("artworks")
        .insert([artworkData]);
      error = insertError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(initialData ? "Artwork updated" : "Artwork added");
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (PKR)</Label>
            <Input id="price" type="number" {...register("price")} />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register("status")}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventory">Inventory</Label>
              <Input
                id="inventory"
                type="number"
                {...register("inventory", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={4} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Images</Label>
            <div
              {...getRootProps()}
              className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-zinc-200 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600 ${
                isDragActive
                  ? "border-zinc-950 bg-zinc-50 dark:bg-zinc-900"
                  : ""
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-zinc-500" />
                  <p className="mt-2 text-sm text-zinc-500">
                    Click or drag images here
                  </p>
                </>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-square rounded-md border border-zinc-200 dark:border-zinc-800"
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                {...register("dimensions")}
                placeholder="e.g. 24x36 inches"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Input
                id="medium"
                {...register("medium")}
                placeholder="e.g. Oil on Canvas"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL (YouTube/Vimeo)</Label>
            <Input
              id="video_url"
              {...register("video_url")}
              placeholder="https://..."
            />
            {errors.video_url && (
              <p className="text-sm text-red-500">{errors.video_url.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Button
          type="submit"
          disabled={loading || uploading}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : initialData ? (
            "Update Artwork"
          ) : (
            "Add Artwork"
          )}
        </Button>
      </div>
    </form>
  );
}
