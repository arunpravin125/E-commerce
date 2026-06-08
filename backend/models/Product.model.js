import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      reuired: 0,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Poduct", productSchema);
