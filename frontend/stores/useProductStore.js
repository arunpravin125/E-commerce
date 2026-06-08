import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post(
        "/product/createProduct",
        productData,
      );
      console.log("createProduct", res.data);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error || "falied to createProduct");
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post(`/product/${id}`);
      set((preProducts) => ({
        products: preProducts.products.filter((product) => product._id !== id),
        loading: false,
      }));

      // set({products})
    } catch (error) {
      toast.error(error.response.data.error || "Failed to deleteProduct");
      set({ loading: false });
    }
  },
  fetchAllProduct: async (id) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.get("/product");
      console.log("FetchAllProducts", res.data.products);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response.data.error || "falied to fetchAllProduct");
      set({ error: "Failed to fetch products", loading: false });
    }
  },
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.patch(`/product/${id}`);
      console.log("toggleFeaturedProduct", res.data);
      set((preProducts) => ({
        products: preProducts.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: res.data.isFeatured }
            : product,
        ),
        loading: false,
      }));
      // set((prevProducts) => ({
      // 	products: prevProducts.products.map((product) =>
      // 		product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
      // 	),
      // 	loading: false,
      // }));
    } catch (error) {
      toast.error(error?.response?.data?.error || "falied to fetchAllProduct");
      set({ error: "Failed to fetch products", loading: false });
    }
  },
  fetchProductsByCategory: async (category) => {
    // mark loading true while fetching
    set({ loading: true });

    try {
      const res = await axiosInstance.get(`/product/category/${category}`);
      console.log("fetchProductsByCategory", res.data);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(
        error.response.data.error || "falied to fetchProductsByCategory",
      );
      set({ error: "Failed to fetchProductsByCategory", loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/product/featuredProducts");
      set({ products: res.data, loading: false });
      console.log("fetchFeaturedProduct", res.data);
    } catch (error) {
      set({ loading: false, error: "Failed to fetch product" });
      console.log("Error fetching featured products", error);
    }
  },
}));
