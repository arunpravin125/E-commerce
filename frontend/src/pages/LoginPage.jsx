import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader,
  Eye,
  EyeOff,
  EyeClosed,
  LogInIcon,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";

const LoginPage = () => {
  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const {checkAuth} = useUserStore

  const [passwordSeen, setPasswordSeen] = useState(false);
  const { login, loading, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
    console.log("formdata", formData);
  };

  const passwordVisible = () => {
    setPasswordSeen(!passwordSeen);
  };
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="mt-6 text-center text-3xl front-extrabold text-emerald-400">
          Create your Account
        </h2>
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-gray-800 py-8 px-4 shadow  sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  password
                </label>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                <input
                  id="password"
                  type={passwordSeen ? "password" : "text"}
                  required
                  placeholder="*********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block z-30 w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
                <div
                  onClick={passwordVisible}
                  className="absolute hover:bg-green-700 hover:cursor-pointer   inset-y-0 right-0 p-3 flex items-center justify-center"
                >
                  {passwordSeen ? (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeOff
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 " aria-hidden="true" />
                    Loading...
                  </>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="mr-2 h-5 w-5 " aria-hidden="true" />
                    <p> Login</p>
                  </div>
                )}
              </button>
            </form>
          </div>
          <div className="flex items-center justify-center p-1 mt-4 gap-2">
            <span>Don't have an account?</span>
            <Link
              to={"/signup"}
              className="flex text-emerald-400 flex-row gap-1 items-center justify-center"
            >
              <p> SignUp here</p>
              <ArrowRight className="w-5 mt-2" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
