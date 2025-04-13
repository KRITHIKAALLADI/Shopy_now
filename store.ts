// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { Product } from "./sanity.types";

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

// interface StoreState {
//   items: CartItem[];
//   addItem: (product: Product) => void;
//   removeItem: (productId: string) => void;
//   deleteCartProduct: (productId: string) => void;
//   resetCart: () => void;
//   getTotalPrice: () => number;
//   getSubTotalPrice: () => number;
//   getItemCount: (productId: string) => number;
//   getGroupedItems: () => CartItem[];
//   //   // favorite
//   favoriteProduct: Product[];
//   addToFavorite: (product: Product) => Promise<void>;
//   removeFromFavorite: (productId: string) => void;
//   resetFavorite: () => void;
// }

// const useStore = create<StoreState>()(
//   persist(
//     (set, get) => ({
//       items: [],
//       favoriteProduct: [],
//       addItem: (product) =>
//         set((state) => {
//           const existingItem = state.items.find(
//             (item) => item.product._id === product._id
//           );
//           if (existingItem) {
//             return {
//               items: state.items.map((item) =>
//                 item.product._id === product._id
//                   ? { ...item, quantity: item.quantity + 1 }
//                   : item
//               ),
//             };
//           } else {
//             return { items: [...state.items, { product, quantity: 1 }] };
//           }
//         }),
//       removeItem: (productId) =>
//         set((state) => ({
//           items: state.items.reduce((acc, item) => {
//             if (item.product._id === productId) {
//               if (item.quantity > 1) {
//                 acc.push({ ...item, quantity: item.quantity - 1 });
//               }
//             } else {
//               acc.push(item);
//             }
//             return acc;
//           }, [] as CartItem[]),
//         })),
//       deleteCartProduct: (productId) =>
//         set((state) => ({
//           items: state.items.filter(
//             ({ product }) => product?._id !== productId
//           ),
//         })),
//       resetCart: () => set({ items: [] }),
//       getTotalPrice: () => {
//         return get().items.reduce(
//           (total, item) => total + (item.product.price ?? 0) * item.quantity,
//           0
//         );
//       },
//       getSubTotalPrice: () => {
//         return get().items.reduce((total, item) => {
//           const price = item.product.price ?? 0;
//           const discount = ((item.product.discount ?? 0) * price) / 100;
//           const discountedPrice = price + discount;
//           return total + discountedPrice * item.quantity;
//         }, 0);
//       },
//       getItemCount: (productId) => {
//         const item = get().items.find((item) => item.product._id === productId);
//         return item ? item.quantity : 0;
//       },
//       getGroupedItems: () => get().items,
//       addToFavorite: (product: Product) => {
//         return new Promise<void>((resolve) => {
//           set((state: StoreState) => {
//             const isFavorite = state.favoriteProduct.some(
//               (item) => item._id === product._id
//             );
//             return {
//               favoriteProduct: isFavorite
//                 ? state.favoriteProduct.filter(
//                     (item) => item._id !== product._id
//                   )
//                 : [...state.favoriteProduct, { ...product }],
//             };
//           });
//           resolve();
//         });
//       },
//       removeFromFavorite: (productId: string) => {
//         set((state: StoreState) => ({
//           favoriteProduct: state.favoriteProduct.filter(
//             (item) => item?._id !== productId
//           ),
//         }));
//       },
//       resetFavorite: () => {
//         set({ favoriteProduct: [] });
//       },
//     }),
//     {
//       name: "cart-store",
//     }
//   )
// );

// export default useStore;


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