import React, { useEffect, useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const Navbar = () => {
  // const user = true;
  const { user, logout } = useUserStore();
  const { cart, addToCart } = useCartStore();
  const [userData, setUserData] = useState(null);
  // const cart = 3;
  const isAdmin = user?.role == "admin";

  useEffect(() => {
    console.log("User", user);
    setUserData(user);
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container max-auto px-4 py-3 flex flex-row justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
        >
          E-Commerce
        </Link>

        <nav className="flex flex-warp items-center justify-center gap-4">
          <Link
            to={"/"}
            className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
          >
            Home
          </Link>
          {userData && (
            <Link to={"/cart"} className="relative group">
              {cart?.length > 0 && (
                <p className="absolute bottom-4 right-1 p-1 w-7 flex  items-center justify-center font-thin bg-green-300 text-gray-600 rounded-full text-xs ">
                  {cart.length > 0 && cart.length}
                </p>
              )}
              <ShoppingCart
                className="inline-block mr-1 group-hover:text-emerald-400"
                size={20}
              />
              <span>Cart</span>
            </Link>
          )}
          {isAdmin && (
            <div className="bg-green-600 p-1 rounded-md w-32">
              <Link
                to={"/secret-dashboard"}
                className="relative group flex  items-center justify-center"
              >
                <Lock
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <p>Dashbaord</p>
              </Link>
            </div>
          )}
          {userData ? (
            <div
              onClick={handleLogout}
              className="bg-gray-600 p-1 cursor-pointer rounded-md w-14 h-8 group flex items-center justify-center"
            >
              <Link
                to={"/login"}
                className="relative  flex transition items-center justify-center"
              >
                <LogOut
                  className="inline-block mr-1 group-hover:text-gray-100"
                  size={20}
                />
                <p className="opacity-0 absolute bottom-7 text-gray-300 group-hover:text-emerald-400    ease-in-out  text-sx md:text-sm  group-hover:duration-700 group-hover:transition group-hover:opacity-100">
                  Logout
                </p>
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-gray-600 p-1 cursor-pointer rounded-md w-14 h-8 group flex items-center justify-center">
                <Link
                  to={"/signup"}
                  className="relative  flex transition items-center justify-center"
                >
                  <UserPlus
                    className="inline-block mr-1 group-hover:text-gray-100"
                    size={20}
                  />
                  <p className="opacity-0 absolute bottom-7 text-gray-300 group-hover:text-emerald-400    ease-in-out  text-sx md:text-sm  group-hover:duration-700 group-hover:transition group-hover:opacity-100">
                    SignUp
                  </p>
                </Link>
              </div>
              <div className="bg-gray-600 p-1 cursor-pointer rounded-md w-14 h-8 group flex items-center justify-center">
                <Link
                  to={"/login"}
                  className="relative  flex transition items-center justify-center"
                >
                  <LogIn
                    className="inline-block mr-1 group-hover:text-gray-100"
                    size={20}
                  />
                  <p className="opacity-0 absolute bottom-7 text-gray-300 group-hover:text-emerald-400    ease-in-out  text-sx md:text-sm  group-hover:duration-700 group-hover:transition group-hover:opacity-100">
                    Login
                  </p>
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
