"use client";
import { Upload, Printer, Copy } from "lucide-react";
import React, { useState } from "react";

function UploadSection({ isDragOver, setIsDragOver }) {
  const [files, setFiles] = useState([]);
  const [printingOptions, setPrintingOptions] = useState({
    pages: "all",
    pageRange: "",
    copies: 1,
    colorMode: "bw",
    sided: "single",
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    const newUploads = files.map((file) => ({
      name: file.name,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.name.split(".").pop().toUpperCase(),
      printingOptions: { ...printingOptions },
    }));

    setFiles([]);
    console.log("Files to upload:", newUploads);
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

          {/* Printing Options */}
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
                        handlePrintingOptionChange("pageRange", e.target.value)
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

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={files.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
              files.length > 0
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {files.length > 0
              ? `Upload ${files.length} file${
                  files.length > 1 ? "s" : ""
                } for printing`
              : "Select files to upload"}
          </button>
        </div>
      </div>
    </>
  );
}

export default UploadSection;
