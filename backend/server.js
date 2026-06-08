import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/authRoutes.js";
import { ConnectMongooseDB } from "./lib/db.js";
import { productRoutes } from "./routes/productRoutes.js";
import { cartRoutes } from "./routes/cartRoutes.js";
import { couponsRoutes } from "./routes/couponsRoutes.js";
import { paymentsRoutes } from "./routes/paymentsRoutes.js";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";

const app = express();

dotenv.config();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const port = process.env.PORT || 5001;
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.listen(port, () => {
  ConnectMongooseDB();
  console.log(`Server is Running on ${port}`);
});
