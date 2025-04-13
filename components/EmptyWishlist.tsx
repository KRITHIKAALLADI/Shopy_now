"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const EmptyWishlist = () => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
        >
          <Heart className="w-8 h-8 text-red-500" />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600">
            Save your favorite items to your wishlist and come back to them
            anytime.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-block bg-shop_dark_green text-white px-6 py-3 rounded-full font-medium hover:bg-shop_dark_green/90 transition-colors"
        >
          Start Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default EmptyWishlist;