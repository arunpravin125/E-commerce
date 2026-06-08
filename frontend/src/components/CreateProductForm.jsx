import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";

const categories = [
  "jeans",
  "T-shirts",
  "shoe",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    countInStock: "",
    image: "",
  });
  const { createProduct, loading } = useProductStore();

  const handleCreateNewProduct = async (e) => {
    e.preventDefault();
    try {
      console.log("newProduct", newProduct);
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        category: "",
        image: "",
        price: "",
      });
    } catch (error) {
      console.log("error in createProduct", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // base64
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleCreateNewProduct} className="space-y-3">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-2 block w-full focus:outline-none bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            type="text"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="mt-2 block w-full focus:outline-none bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="mt-2 block w-full  focus:outline-none bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-2 block w-full  focus:outline-none bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-2"
            required
          >
            <option value=""> Select a Category</option>
            {categories.map((category) => (
              <option className="flex flex-row" key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="file"
            onChange={handleImageChange}
            id="image"
            className="sr-only"
            accept="image/*"
          />
          <label
            htmlFor="image"
            className="inline-block text-sm rounded-md border border-gray-600 outline-1 outline-gray-100 bg-gray-600 p-1  font-medium text-gray-300 mb-2"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-300">
              Image upload successfully
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
