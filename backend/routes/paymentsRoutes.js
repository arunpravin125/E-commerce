import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { Coupons } from "../models/coupons.model.js";
import { stripe } from "../lib/stripe.js";
import dotenv from "dotenv";
import { Order } from "../models/order.model.js";
import {
  checkout_success,
  create_checkout_session,
} from "../controllers/payments.Controller.js";
dotenv.config();

export const paymentsRoutes = express.Router();

paymentsRoutes.post(
  "/create_checkout_session",
  protectRoute,
  create_checkout_session,
);

paymentsRoutes.post("/checkout-success", protectRoute, checkout_success);
