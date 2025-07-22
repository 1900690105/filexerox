"use client";
import { ArrowRight, CheckCircle, Upload, Zap } from "lucide-react";
import React, { useState } from "react";

function HeroSection({ dragActive, setDragActive }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setIsUploading(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setIsUploading(false);
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 200);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleDrop(e);
    }
  };
  return (
    <>
      <section className="relative pt-24 pb-20 px-4 text-center overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-8 shadow-lg">
            <Zap className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Lightning Fast Printing
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Upload.
            </span>{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Print.
            </span>{" "}
            <span className="bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              Pickup.
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Revolutionary cloud printing that connects you to thousands of Xerox
            centers.
            <span className="font-semibold text-gray-800">
              {" "}
              No USB drives. No waiting.
            </span>
          </p>

          {/* Enhanced Upload Zone */}
          <div className="max-w-lg mx-auto mb-8">
            <div
              onClick={() => {
                window.location.href = "/user";
              }}
              className={`relative group cursor-pointer transition-all duration-300 ${
                dragActive ? "scale-105" : "hover:scale-102"
              }`}
              // onDragEnter={handleDrag}
              // onDragLeave={handleDrag}
              // onDragOver={handleDrag}
              // onDrop={handleDrop}
            >
              <div
                className={`
                relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300
                ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/80 shadow-2xl"
                    : "border-gray-300 bg-white/60 hover:bg-white/80 hover:shadow-xl"
                }
                backdrop-blur-sm group-hover:border-blue-400
              `}
              >
                {/* <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                /> */}

                {!isUploading ? (
                  <>
                    <Upload
                      className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                        dragActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Drop your files here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, DOCX, TXT, JPG, PNG up to 50MB
                    </p>
                  </>
                ) : (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-lg font-semibold text-gray-700">
                      {uploadProgress < 100
                        ? `Uploading... ${Math.round(uploadProgress)}%`
                        : "Upload Complete!"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                window.location.href = "/user/dashboard";
              }}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Printing Now
              <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Find Locations
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
