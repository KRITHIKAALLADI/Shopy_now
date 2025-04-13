"use client";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import Title from "@/components/Title";
import useStore from "@/store";
import { useAuth } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import QuantityButtons from "@/components/QuantityButtons";
import PriceFormatter from "@/components/PriceFormatter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    items,
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const shipping = 10;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item._id,
            quantity: getItemCount(item._id),
            price: item.price,
            name: item.name,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      router.push(data.url); // Redirect to Stripe checkout
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {items?.length > 0 ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-sm">
                  {items.map((item, index) => (
                    <div
                      key={`${item._id}-${index}`}
                      className="flex gap-4 border-b py-4 last:border-b-0"
                    >
                      {item.images && (
                        <Link
                          href={`/product/${item.slug?.current}`}
                          className="w-24 h-24 relative flex-shrink-0"
                        >
                          <Image
                            src={urlFor(item.images[0]).url()}
                            alt={item.name || ""}
                            fill
                            className="object-contain"
                          />
                        </Link>
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.slug?.current}`}
                          className="text-base font-medium hover:text-shop_light_green"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-2 flex items-center justify-between">
                          <PriceFormatter
                            amount={item.price}
                            className="text-shop_dark_green"
                          />
                          <button
                            onClick={() => deleteCartProduct(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="mt-2">
                          <QuantityButtons product={item} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 lg:mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <PriceFormatter amount={shipping} />
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <PriceFormatter
                            amount={getTotalPrice() + shipping}
                            className="text-shop_dark_green"
                          />
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4"
                        onClick={handleCheckout}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;