// import Redis from "ioredis";
import { redis } from "../lib/redis.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storerefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_Token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  ); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 min
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user?._id);
      await storerefreshToken(user?._id, refreshToken);

      setCookies(res, accessToken, refreshToken);
      res.json({
        message: "Login Successfully",
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log("error in Login", error);
    res.status(401).json({ message: "error in login:", error });
  }
};
export const SignUp = async (req, res) => {
  try {
    const { name, password, confirmPassword, email } = req.body;

    if (!name || !password || !confirmPassword || !email) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and ConfirmPassword must be same" });
    }
    const userEmailExists = await User.findOne({ email });
    if (userEmailExists) {
      return res.status(400).json({ message: "User Email already exists" });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    await user.save();
    const { accessToken, refreshToken } = generateToken(user?._id);
    await storerefreshToken(user?._id, refreshToken);

    setCookies(res, accessToken, refreshToken);
    res.status(201).json({
      message: "SignUp successfully",

      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
      },
    });
  } catch (error) {
    console.log("Error in SignUp", error);
    res.status(400).json({ message: error.message });
  }
};
export const Logout = async (req, res) => {
  try {
    const refresh_Token = req.cookies.refreshToken;
    if (refresh_Token) {
      const decoded = jwt.verify(
        refresh_Token,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refresh_Token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Sever Error", error });
    console.log("error in logout", error);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const refresh_Token = req.cookies.refreshToken;
    if (refresh_Token) {
      const decoded = jwt.verify(
        refresh_Token,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const storedrefershToken = await redis.get(
        `refresh_Token:${decoded?.userId}`,
      );
      if (storedrefershToken !== refresh_Token) {
        return res.status(401).json({ message: "inlaid refresh_Token" });
      }
      console.log("refreshTokenController", decoded);
      const { accessToken, refreshToken } = generateToken(decoded.userId);
      await storerefreshToken(decoded.userId, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.status(200).json({ message: "Access Token created" });
    } else {
      res.status(401).json({ message: "Token not found" });
    }
  } catch (error) {
    console.log("error in refreshTokenController", error);
    res.status(500).json({ message: "error in refreshTokenController" });
  }
};

export const userProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.log("error in userProfile:", error);
    res.status(400).json({ message: "error in userProfile:", error });
  }
};
