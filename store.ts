

import { Product } from "@/sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  items: Product[];
  favoriteProduct: Product[];
  addItem: (item: Product) => void;
  removeItem: (itemId: string) => void;
  deleteCartProduct: (itemId: string) => void;
  addToFavorite: (item: Product) => Promise<void>;
  getItemCount: (itemId: string) => number;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getGroupedItems: () => Product[];
  resetCart: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],

      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }));
      },

      removeItem: (itemId) => {
        set((state) => {
          const itemsWithCurrentId = state.items.filter(
            (item) => item._id === itemId
          );
          const lastIndex = state.items.lastIndexOf(
            itemsWithCurrentId[itemsWithCurrentId.length - 1]
          );
          return {
            items: state.items.filter((_, index) => index !== lastIndex),
          };
        });
      },

      deleteCartProduct: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        }));
      },

      addToFavorite: async (item) => {
        set((state) => {
          const isExisting = state.favoriteProduct.find(
            (product) => product._id === item._id
          );
          if (isExisting) {
            return {
              favoriteProduct: state.favoriteProduct.filter(
                (product) => product._id !== item._id
              ),
            };
          } else {
            return {
              favoriteProduct: [...state.favoriteProduct, item],
            };
          }
        });
      },

      getItemCount: (itemId) => {
        return get().items.filter((item) => item._id === itemId).length;
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemCount = get().getItemCount(item._id);
          const itemPrice = item.price || 0;
          const itemDiscount = item.discount || 0;
          const discountedPrice = itemPrice - (itemPrice * itemDiscount) / 100;
          return total + discountedPrice;
        }, 0);
      },

      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemCount = get().getItemCount(item._id);
          return total + (item.price || 0) * itemCount;
        }, 0);
      },

      getGroupedItems: () => {
        return get().items.reduce<Product[]>((items, item) => {
          if (!items.find((i) => i._id === item._id)) {
            items.push(item);
          }
          return items;
        }, []);
      },

      resetCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "shopcart-storage", // unique name for localStorage
      skipHydration: true, // Skip hydration warning in development
    }
  )
);

export default useStore;