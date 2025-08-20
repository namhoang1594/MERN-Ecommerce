import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShopProduct } from "@/store/shop/products-slice/allProducts-slice/allProducts.types";

interface ProductImageGalleryProps {
  image: ShopProduct["image"];
}

export default function ProductImageGallery({
  image,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!image || image.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-xl">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  const activeImage = image[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Ảnh chính */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl border bg-white group">
        <img
          src={activeImage.url}
          alt="product image"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {image.map((img, idx) => (
          <button
            key={img.public_id}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2",
              activeIndex === idx ? "border-black" : "border-transparent"
            )}
          >
            <img
              src={img.url}
              alt={`thumbnail-${idx}`}
              className="object-cover"
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
