import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  loading: false,
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  getCoupons: async () => {
    try {
      const res = await axiosInstance.get("/coupons");
      console.log("getCoupons", res.data);
      set({ coupon: res.data });
    } catch (error) {
      console.log("error in getCoupons", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const res = await axiosInstance.post("/coupons/validate", {
        code,
      });
      console.log("applyCoupon", res.data);
      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotals();
    } catch (error) {
      toast.error(error?.response?.data?.message || "failed to apply coupon");
    }
  },

  removeCoupon: async () => {
    console.log("removeCoupon");
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("coupon removed");
  },

  getCartItems: async () => {
    set({ loading: true });

    try {
      const res = await axiosInstance.get("/cart/");

      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occured in getCartItems",
      );
      set({ cart: [], loading: false });
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, subTotal: 0, total: 0 });
  },
  addToCart: async (product) => {
    try {
      const res = await axiosInstance.post("/cart", {
        productId: product?._id,
      });

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item?._id == product?._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item?._id == product?._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occured in addToCartItems",
      );
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true });

    const res = await axiosInstance.delete("/cart", { data: { productId } });

    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotals();
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    const res = await axiosInstance.put(`/cart/${productId}`, { quantity });

    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item?._id == productId ? { ...item, quantity } : item,
      ),
    }));

    get().calculateTotals();
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
