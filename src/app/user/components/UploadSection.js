"use client";
import {
  Upload,
  Printer,
  Copy,
  Building2,
  CheckCircle,
  XCircle,
  X,
  Settings,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../utils/firebaseConfig"; // Adjust the import path based on your Firebase config location

function UploadSection({ isDragOver, setIsDragOver }) {
  const [user, loading, error] = useAuthState(auth);
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [setting, setSetting] = useState(false);
  const [printingOptions, setPrintingOptions] = useState({
    pages: "all",
    pageRange: "",
    copies: 1,
    colorMode: "bw",
    sided: "single",
    pagePerSheet: "1",
    xeroxCenterCode: "",
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Function to save file data to Firebase
  const saveToFirebase = async (fileData) => {
    const filecode = Math.floor(1000 + Math.random() * 9000);
    try {
      const docRef = await addDoc(collection(db, "userfiles"), {
        ...fileData,
        uploadedAt: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    // Validate xerox center code (if you want to make it required)
    if (!printingOptions.xeroxCenterCode.trim()) {
      showToast("Please enter a xerox center code", "error");
      return;
    }

    setIsUploading(true);

    try {
      const filecode = Math.floor(1000 + Math.random() * 9000);
      // Prepare file data for Firebase
      const fileDataPromises = files.map(async (file) => {
        const fileData = {
          name: file.name,
          date: new Date().toISOString().split("T")[0],
          status: "Pending",
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.name.split(".").pop().toUpperCase(),
          xeroxCenterCode: printingOptions.xeroxCenterCode,
          ...(setting && { printingOptions: { ...printingOptions } }),
        };

        // Save to Firebase
        const docId = await saveToFirebase(fileData);

        return {
          ...fileData,
          firebaseId: docId,
          code: filecode,
        };
      });

      // Wait for all files to be saved
      const savedFiles = await Promise.all(fileDataPromises);

      // Simulate additional processing time (optional)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFiles([]);
      showToast(
        `${savedFiles.length} file${
          savedFiles.length > 1 ? "s" : ""
        } uploaded successfully!`,
        "success"
      );

      console.log("Files uploaded and saved to Firebase:", savedFiles);
    } catch (error) {
      showToast(
        "Upload failed. Please check your connection and try again.",
        "error"
      );
      console.error("Upload/Firebase error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handlePrintingOptionChange = (field, value) => {
    setPrintingOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div
            className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg backdrop-blur-lg border ${
              toast.type === "success"
                ? "bg-green-50/90 border-green-200 text-green-800"
                : "bg-red-50/90 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={hideToast}
              className={`ml-2 hover:bg-white/20 rounded-full p-1 transition-colors ${
                toast.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <span>Upload Your Files</span>
        </h2>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : files.length > 0
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  files.length > 0 ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <Upload
                  className={`w-8 h-8 ${
                    files.length > 0 ? "text-green-600" : "text-gray-400"
                  }`}
                />
              </div>

              {files.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-green-800">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-lg p-2 text-sm"
                      >
                        <span className="text-green-700 truncate flex-1">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(1)}{" "}
                          MB)
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    Drop your files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX files up to 10MB each • Select
                    multiple files
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              onChange={handleFileChange}
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx"
            />
          </div>
          {/* Xerox Center Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Xerox Center Code</span>
            </label>
            <input
              type="text"
              placeholder="Enter center code"
              value={printingOptions.xeroxCenterCode}
              onChange={(e) =>
                handlePrintingOptionChange("xeroxCenterCode", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              className="bg-blue-400 p-2 rounded-xl text-white flex gap-2"
              onClick={() => {
                setSetting(!setting);
              }}
            >
              <Settings />
              {!setting ? "Open Settings" : "Close Setting"}
            </button>
          </div>

          {/* Printing Options */}
          {setting && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center space-x-2">
                <Printer className="w-5 h-5 text-purple-600" />
                <span>Choose Printing Options</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pages Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pages
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pages"
                        value="all"
                        checked={printingOptions.pages === "all"}
                        onChange={(e) =>
                          handlePrintingOptionChange("pages", e.target.value)
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">All pages</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pages"
                        value="range"
                        checked={printingOptions.pages === "range"}
                        onChange={(e) =>
                          handlePrintingOptionChange("pages", e.target.value)
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Page range:</span>
                    </label>
                    {printingOptions.pages === "range" && (
                      <input
                        type="text"
                        placeholder="e.g., 1-5, 10, 15-20"
                        value={printingOptions.pageRange}
                        onChange={(e) =>
                          handlePrintingOptionChange(
                            "pageRange",
                            e.target.value
                          )
                        }
                        className="ml-6 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>

                {/* Color Mode */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Color Mode
                  </label>
                  <select
                    value={printingOptions.colorMode}
                    onChange={(e) =>
                      handlePrintingOptionChange("colorMode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="bw">Black & White</option>
                    <option value="color">Color</option>
                  </select>
                </div>

                {/* Single/Double Sided */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Printing Side
                  </label>
                  <select
                    value={printingOptions.sided}
                    onChange={(e) =>
                      handlePrintingOptionChange("sided", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="single">Single-sided</option>
                    <option value="double">Double-sided</option>
                  </select>
                </div>

                {/* Page per Sheet */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pages per Sheet
                  </label>
                  <select
                    value={printingOptions.pagePerSheet}
                    onChange={(e) =>
                      handlePrintingOptionChange("pagePerSheet", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1 page per sheet</option>
                    <option value="2">2 pages per sheet</option>
                    <option value="4">4 pages per sheet</option>
                    <option value="6">6 pages per sheet</option>
                    <option value="9">9 pages per sheet</option>
                    <option value="16">16 pages per sheet</option>
                  </select>
                </div>

                {/* Number of Copies */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>Number of Copies</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        handlePrintingOptionChange(
                          "copies",
                          Math.max(1, printingOptions.copies - 1)
                        )
                      }
                      className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={printingOptions.copies}
                      onChange={(e) =>
                        handlePrintingOptionChange(
                          "copies",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePrintingOptionChange(
                          "copies",
                          Math.min(100, printingOptions.copies + 1)
                        )
                      }
                      className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              files.length > 0 && !isUploading
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <span>
                {files.length > 0
                  ? `Upload ${files.length} file${
                      files.length > 1 ? "s" : ""
                    } for printing`
                  : "Select files to upload"}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default UploadSection;
