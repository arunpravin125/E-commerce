import { json } from "node:stream/consumers";
import { redis } from "../lib/redis.js";
import { Product } from "../models/Product.model.js";
import cloudinary from "../lib/cloudinary.js";

// const crypto = require("crypto");

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, isFeatured } = req.body;
    // console.log("createProduct", name, description, price, image, category);

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "",
      category,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.log("error in createProduct", error);
    res.status(400).json({ message: "error in createProduct", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // findAllProducts
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error);
    res.status(400).json({ message: "error in getAllProducts controller" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured prodicts found" });
    }
    // store redis for future quick accessToken

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("error in featured_products controller", error);
    res.status(400).json({ message: "error in featured_products:", error });
  }
};

export const recommendationProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      }, // three different products
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        }, // populated the feilds
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("error in recommendationProducts", error);
    res
      .status(400)
      .json({ message: "error in recommendationProducts:", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product?.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product delete successfully" });
  } catch (error) {
    console.log("error in deleteProduct", error);
    res.status(400).json({ message: "error in deleteProduct", error });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("error in getProductsByCategory:", error);
  }
};

export const toggleFeaturedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();

      await updatedFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("error in toggleFeaturedProducts:", error);
    res
      .status(400)
      .json({ message: "error in toggleFeaturedProducts:", error });
  }
};

async function updatedFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in updatedFeaturedProductsCache", error);
  }
}
