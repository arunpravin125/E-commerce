import React, { useEffect, useState } from "react";
// import { Product } from "../../../backend/models/Product.model";
import axios from "axios";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "../pages/ProductCard";

const PeopleAlsoBought = () => {
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/product/recommendations");
        setRecommendation(res.data);
      } catch (error) {
        console.log("error in fetchRecommendations", error);
        toast.error(
          error.message || "An error occured in fetchRecommendations",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought{" "}
      </h3>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 grid-cols-4 ">
        {recommendation?.map((product) => (
          <ProductCard product={product} key={product?._id} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
