"use client";
import { Product } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import useStore from "@/store";
import AddToCartButton from "./AddToCartButton";
import PriceView from "./PriceView";

interface Props {
  products: Product[];
}

const WishlistProducts = ({ products }: Props) => {
  const { addToFavorite } = useStore();

  const handleRemove = (product: Product) => {
    addToFavorite(product);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="relative group">
            <Link href={`/product/${product.slug?.current}`}>
              {product.images && (
                <Image
                  src={urlFor(product.images[0]).url()}
                  alt={product.name || "Product"}
                  width={500}
                  height={500}
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </Link>
            <button
              onClick={() => handleRemove(product)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            <Link
              href={`/product/${product.slug?.current}`}
              className="text-sm font-medium hover:text-shop_light_green transition-colors line-clamp-2"
            >
              {product.name}
            </Link>

            <PriceView
              price={product.price}
              discount={product.discount}
              className="text-base"
            />

            <div className="pt-2">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistProducts;