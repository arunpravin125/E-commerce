import React, { useEffect } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const { fetchProductsByCategory, products, loading } = useProductStore();
  //   const products = useProductStore((s) => s.products);
  const { category } = useParams();

  //   const products = [
  //     {
  //       name: "shoe",
  //       description: "shoess",
  //       price: "20",
  //       image: "",
  //       category: "shoes",
  //     },
  //   ];

  // if (loading) return <LoadingSpinner />;

  useEffect(() => {
    if (!category) return;
    fetchProductsByCategory(category);
  }, [category, fetchProductsByCategory]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>
        {loading ? (
          <div className="flex  bg-transparent justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* {<LoadingSpinner />} */}
            {(!products || products.length === 0) && (
              <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
                No Products found
              </h2>
            )}

            {products?.map((product) => {
              return <ProductCard product={product} />;
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
