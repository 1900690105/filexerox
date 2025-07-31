"use client";
import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  File,
  Image,
  Video,
  Archive,
  FileSpreadsheet,
  FileCode,
  ImageDown,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../utils/firebaseConfig";
import { useParams } from "next/navigation";
import PrintingSuccessPopup from "@/app/components/OrderPopUp";

const UploadPage = () => {
  const params = useParams();
  const code = params.code;
  const [files, setFiles] = useState([]);
  const [xeroxCode, setXeroxCode] = useState(code || 2025);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(extension)
    ) {
      return <ImageDown className="w-5 h-5 text-blue-600" />;
    } else if (
      ["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension)
    ) {
      return <Video className="w-5 h-5 text-purple-600" />;
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <Archive className="w-5 h-5 text-yellow-600" />;
    } else if (["xls", "xlsx", "csv"].includes(extension)) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    } else if (
      ["js", "ts", "html", "css", "py", "java", "cpp", "c"].includes(extension)
    ) {
      return <FileCode className="w-5 h-5 text-gray-600" />;
    } else {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    const validFiles = [];
    let hasError = false;

    newFiles.forEach((file) => {
      // Validate file size (max 50MB per file)
      if (file.size > 50 * 1024 * 1024) {
        setError(
          `File "${file.name}" is too large. Maximum size is 50MB per file.`
        );
        hasError = true;
        return;
      }

      // Check for duplicates
      const isDuplicate = files.some(
        (existingFile) =>
          existingFile.name === file.name && existingFile.size === file.size
      );

      if (!isDuplicate) {
        validFiles.push({
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    });

    if (!hasError) {
      setFiles((prev) => [...prev, ...validFiles]);
      setError("");
      setUploadSuccess(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !xeroxCode.trim()) {
      setError("Please select at least one file and enter Xerox center code");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("fileName", fileData.name);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (!result.url) throw new Error("Upload failed");

        uploadedFiles.push({
          fileName: fileData.name,
          fileSize: fileData.size,
          fileType: fileData.type,
          imageUrl: result.url,
        });
      }

      const id = Math.floor(10 + Math.random() * 90);
      setOrderId(id);
      await addDoc(collection(db, "xeroxUploads"), {
        xeroxCenterCode: xeroxCode,
        files: uploadedFiles,
        totalFiles: uploadedFiles.length,
        orderid: id,
        createdAt: serverTimestamp(),
      });

      setUploadSuccess(true);
      setFiles([]);
      setXeroxCode("");
      fileInputRef.current.value = "";
      setIsVisible(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError("Error uploading files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setError("");
  };

  const clearAllFiles = () => {
    setFiles([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Upload Successful!</p>
              <p className="text-green-600 text-sm">
                All {files.length} files have been sent to the Xerox center.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Main Upload Card */}
        {!isVisible ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* File Upload Area */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Document Upload
                </label>
                {files.length > 0 && (
                  <button
                    onClick={clearAllFiles}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer mb-4 ${
                  dragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload
                  className={`w-12 h-12 mx-auto mb-4 ${
                    dragOver ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {dragOver
                    ? "Drop your files here"
                    : "Choose files or drag them here"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  All file formats supported • Up to 50MB per file
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>
                      {files.length} file{files.length !== 1 ? "s" : ""}{" "}
                      selected
                    </span>
                    <span>Total: {formatFileSize(getTotalSize())}</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {files.map((fileData) => (
                      <div
                        key={fileData.id}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                              {getFileIcon(fileData.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {fileData.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(fileData.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(fileData.id)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Xerox Code Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Xerox Center Code
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your center code (e.g., XRC001)"
                  value={xeroxCode}
                  onChange={(e) => setXeroxCode(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Find your nearest center code on our locations page
              </p>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0 || !xeroxCode.trim()}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-200 ${
                uploading || files.length === 0 || !xeroxCode.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading {files.length} file{files.length !== 1 ? "s" : ""}
                  ...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload{" "}
                  {files.length > 0
                    ? `${files.length} File${files.length !== 1 ? "s" : ""}`
                    : "Files"}{" "}
                  & Send to Center
                </div>
              )}
            </button>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> Upload multiple files of any
                format, enter your nearest Xerox center code, and we&#39;ll send
                them all directly to the center. You can pick up your prints
                within 30 minutes.
              </p>
            </div>
          </div>
        ) : (
          <PrintingSuccessPopup
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            id={orderId}
          />
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            All file formats supported • Upload multiple files at once • We
            delete your files after Trasation
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
