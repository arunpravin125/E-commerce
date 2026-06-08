import express from "express";
import {
  addToCart,
  getCartProducts,
  removeALLFromCart,
  updateQuatity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

export const cartRoutes = express.Router();

cartRoutes.get("/", protectRoute, getCartProducts);
cartRoutes.post("/", protectRoute, addToCart);
cartRoutes.delete("/", protectRoute, removeALLFromCart);
cartRoutes.put("/:id", protectRoute, updateQuatity);
