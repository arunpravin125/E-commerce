import express from "express";
import {
  Login,
  Logout,
  refreshTokenController,
  SignUp,
  userProfile,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

export const authRoutes = express.Router();

authRoutes.post("/login", Login);
authRoutes.post("/signUp", SignUp);
authRoutes.post("/logout", Logout);
authRoutes.post("/refreshToken", refreshTokenController);
authRoutes.get("/profile", protectRoute, userProfile);
