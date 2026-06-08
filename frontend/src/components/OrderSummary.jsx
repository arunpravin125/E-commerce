import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
const stripePromise = loadStripe(
  "pk_test_51TauCYLjxiQK0ALmAEV7g4LV64ESi7wfAJOtBrJskK8yF72NbOQHyXyvp4RxaboaDP7Cn0N5NeL2ucxovb8poJ3W00VBoNhn6s",
);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart, getCoupons } =
    useCartStore();

  useEffect(() => {
    getCoupons();
  }, []);

  const savings = subtotal - total;

  const handleStripePayment = async () => {
    const stripe = await stripePromise;

    try {
      const res = await axiosInstance.post(
        "/payments/create_checkout_session",
        {
          products: cart,
          couponCode: coupon ? coupon.code : null,
        },
      );

      // const session = res.data;
      // const result = await stripe.redirectToCheckout({
      //   sessionId: session.id,
      // });
      const session = res.data;

      if (!session?.url) {
        throw new Error("Stripe checkout URL not returned from server");
      }

      window.location.href = session.url;
      console.log("session", session);
    } catch (error) {
      console.log("error in handleStripePayment", error);
      toast.error(error?.respone?.message || "An error occured in stripe");
    }
  };

  const formattedSubtotal = subtotal?.toFixed(2);
  const formattedTotal = total?.toFixed(2);
  const formattedSavings = savings?.toFixed(2);

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order Summary</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original Price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>
          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                ${formattedSavings}
              </dd>
            </dl>
          )}
          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -${coupon?.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>
        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emeraled-700 focus:outline-none focus:rign-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStripePayment}
        >
          Proceed to Checkout
        </motion.button>
        <div className="flex items-start justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm  font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
