"use client";
import Container from "@/components/Container";
import EmptyWishlist from "@/components/EmptyWishlist";
import NoAccess from "@/components/NoAccess";
import Title from "@/components/Title";
import useStore from "@/store";
import { useAuth } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import WishlistProducts from "@/components/WishlistProducts";

const WishlistPage = () => {
  const { favoriteProduct } = useStore();
  const { isSignedIn } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {isSignedIn ? (
        <Container>
          {favoriteProduct?.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Heart className="text-shop_dark_green" />
                <Title>My Wishlist</Title>
              </div>
              <WishlistProducts products={favoriteProduct} />
            </>
          ) : (
            <EmptyWishlist />
          )}
        </Container>
      ) : (
        <NoAccess details="Sign in to view and manage your wishlist" />
      )}
    </div>
  );
};

export default WishlistPage;
