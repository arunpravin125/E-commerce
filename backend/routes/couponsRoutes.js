import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCoupon,
  validateCoupon,
} from "../controllers/coupons.controller.js";

export const couponsRoutes = express.Router();

couponsRoutes.get("/", protectRoute, getCoupon);
couponsRoutes.post("/validate", protectRoute, validateCoupon);
