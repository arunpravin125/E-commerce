import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  recommendationProducts,
  toggleFeaturedProducts,
} from "../controllers/productController.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

export const productRoutes = express.Router();

productRoutes.get("/", protectRoute, adminRoute, getAllProducts);
productRoutes.get("/featuredProducts", getFeaturedProducts);
productRoutes.get("/category/:category", getProductsByCategory);
productRoutes.get("/recommendations", protectRoute, recommendationProducts);
productRoutes.post("/createProduct", protectRoute, adminRoute, createProduct);
productRoutes.post("/:id", protectRoute, adminRoute, deleteProduct);
productRoutes.patch("/:id", protectRoute, adminRoute, toggleFeaturedProducts);
