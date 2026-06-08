import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      console.log("Access token not found");
      return res.status(401).json({ message: "Access token not found" });
    }
    const decoded = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const user = await User.findById(decoded?.userId).select("-password");
    console.log("User", user);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("error in protectRoute middleware", error);
    return res.status(400).json({ message: "Unathizied invlaid token" });
  }
};

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized - Admin only" });
  }
};
