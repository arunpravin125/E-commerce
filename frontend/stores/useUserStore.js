import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Password do not match");
    }

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });
      toast.success(res.data.message);
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  login: async ({ email, password }) => {
    set({ loading: true });

    if (!email || !password) {
      set({ loading: false });
      return toast.error("Please enter Email and password");
    }

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log("LoginData", res);

      if (res.statusText == "ok") {
        toast.success(res.data.message);
      }

      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  logout: async () => {
    set({ loading: true });

    try {
      const res = await axiosInstance.post("/auth/logout");
      console.log("logout", res.data);
      toast.success(res.data.message);
      set({ user: null, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      toast.error(
        error.response.data.message || "An error occurred checkAuth",
        { id: "logout" },
      );
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/refreshToken");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false, loading: false });

      throw error;
    }
  },
}));

let refreshPromise = null;

// for refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 || (404 && !originalRequest._retry)) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();

        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
