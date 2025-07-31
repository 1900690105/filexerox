import React, { useState, useEffect } from "react";
import { CheckCircle, X, Printer, Copy } from "lucide-react";

const PrintingSuccessPopup = ({ isVisible, setIsVisible, id }) => {
  const [copied, setCopied] = useState(false);

  // Generate a random order ID for demo
  const orderId = id;

  useEffect(() => {
    // Show popup after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Copy failed");
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 backdrop-blur-sm transition-all duration-300 ${
          isVisible ? "backdrop-blur-sm" : "backdrop-blur-none"
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success icon with animation */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Printer className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Success message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your printing order has been placed successfully and is being
            processed.
          </p>

          {/* Order ID section */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Order ID</div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
              <span className="font-mono text-lg font-semibold text-gray-900">
                {orderId}
              </span>
              <button
                onClick={copyOrderId}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy Order ID"
              >
                <Copy size={16} />
              </button>
            </div>
            {copied && (
              <div className="text-xs text-green-600 mt-1">
                Order ID copied to clipboard!
              </div>
            )}
          </div>

          {/* Status info */}
          <div className="text-sm text-gray-500 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Processing your order...</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Continue
            </button>
            <button
              onClick={() => window.print()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintingSuccessPopup;
