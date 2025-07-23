"use client";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Store } from "lucide-react";

export default function XeroxAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(isLogin ? "Logging in..." : "Signing up...", formData);
    setIsLoading(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      shopName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className=" mt-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Main Form Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Xerox Center
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {isLogin
                ? "Welcome back! Please sign in to continue."
                : "Create your account to get started."}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Shop Name Field (Signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Shop Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    suppressHydrationWarning
                    type="text"
                    name="shopName"
                    onChange={handleChange}
                    value={formData.shopName}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm sm:text-base bg-white/50"
                    placeholder="Enter your shop name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  suppressHydrationWarning
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm sm:text-base bg-white/50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full pl-10 pr-12 py-3 sm:py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm sm:text-base bg-white/50"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={handleChange}
                    value={formData.confirmPassword}
                    className="w-full pl-10 pr-12 py-3 sm:py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm sm:text-base bg-white/50"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </span>
                </div>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </div>

          {/* Toggle Form */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base mb-3">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={toggleForm}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm sm:text-base underline decoration-2 underline-offset-4 hover:decoration-indigo-700"
            >
              {isLogin ? "Create Account" : "Sign In Instead"}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By {isLogin ? "signing in" : "creating an account"}, you agree to
              our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2025 Xerox Center. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
