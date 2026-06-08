import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../../stores/useCartStore";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState(null);

  const { coupon, isCouponApplied, applyCoupon, removeCoupon, getCoupons } =
    useCartStore();

  useEffect(() => {
    getCoupons;
  }, [getCoupons]);

  useEffect(() => {
    if (coupon) {
      console.log("coupon in GiftCouponCard", coupon);
      setUserInputCode(coupon?.code);
    }
  }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
    console.log("userInputCode", userInputCode.code);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
    // console.log();
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-6">
        <div>
          <label>Do you have a voucher or gift card</label>
          <input
            type="text"
            id="voucher"
            className="block w-full mt-2 rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>
        <motion.button
          type="button"
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 foucs:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTop={{ scale: 0.95 }}
          onClick={handleApplyCoupon}
        >
          Apply Code
        </motion.button>
      </div>
      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mt-3 text-gray-300">
            Applied Coupon
          </h3>
          <p>
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
          <motion.button
            type="button"
            className="flex w-full items-center justify-center rounded-lg bg-red-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 foucs:outline-none focus:ring-4 focus:ring-emerald-300"
            whileHover={{ scale: 1.05 }}
            whileTop={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}
      {coupon && (
        <div className="mt-4 ">
          <h3 className="text-lg font-medium text-gray-300 ">
            Your Available Coupon
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
