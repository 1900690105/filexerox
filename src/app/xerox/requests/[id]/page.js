"use client";

import { useState } from "react";
import {
  Eye,
  Printer,
  Clock,
  FileText,
  Image,
  File,
  X,
  Download,
} from "lucide-react";

export default function RequestDetailsPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const request = [
    {
      uniqueId: "REQ-001",
      time: "2025-07-22T10:45:00Z",
      files: [
        {
          filename: "mark.pdf",
          settings: {
            color: "black_and_white",
            sides: "double_sided",
            paperSize: "A4",
            pagesPerSheet: 2,
            numberOfCopies: 3,
            pages: "all",
          },
        },
        {
          filename: "mark2.docx",
          settings: {
            color: "color",
            sides: "single_sided",
            paperSize: "Letter",
            pagesPerSheet: 1,
            numberOfCopies: 1,
            pages: "1-5",
          },
        },
        {
          filename: "mark3.pptx",
          settings: {
            color: "color",
            sides: "single_sided",
            paperSize: "A4",
            pagesPerSheet: 1,
            numberOfCopies: 2,
            pages: "all",
          },
        },
      ],
      status: "pending",
    },
    {
      uniqueId: "REQ-002",
      time: "2025-07-22T11:00:00Z",
      files: [
        {
          filename: "logo.png",
          settings: {
            color: "black_and_white",
            sides: "double_sided",
            paperSize: "A4",
            pagesPerSheet: 2,
            numberOfCopies: 4,
            pages: "all",
          },
        },
      ],
      status: "in_progress",
    },
  ];

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <Image className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFileClick = async (file, requestId) => {
    console.log("Attempting to access file:", file.filename);

    setSelectedFile({ ...file, requestId });
    setShowPreview(true);

    const extension = file.filename.split(".").pop().toLowerCase();
    const fileUrl = `/${file.filename}`;

    // Test if file is actually accessible
    try {
      const response = await fetch(fileUrl, { method: "HEAD" });
      console.log(`File ${file.filename} - Status: ${response.status}`);

      if (response.ok) {
        console.log(`✅ File ${file.filename} is accessible`);
        setSelectedFile({
          ...file,
          requestId,
          fileUrl: fileUrl,
          isAccessible: true,
        });
      } else {
        console.log(
          `❌ File ${file.filename} returned status: ${response.status}`
        );
        setSelectedFile({
          ...file,
          requestId,
          fileUrl: null,
          isAccessible: false,
          error: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      console.error(`❌ Error accessing ${file.filename}:`, error);
      setSelectedFile({
        ...file,
        requestId,
        fileUrl: null,
        isAccessible: false,
        error: error.message,
      });
    }
  };

  const handlePrint = () => {
    if (selectedFile.fileUrl) {
      // Open the PDF in a new window for printing
      const printWindow = window.open(selectedFile.fileUrl, "_blank");
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    } else {
      // Fallback for files without actual data
      alert(`Printing ${selectedFile.filename}...`);
    }
  };

  const FilePreviewModal = () => {
    if (!showPreview || !selectedFile) return null;

    const extension = selectedFile.filename.split(".").pop().toLowerCase();
    const isImage = ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(
      extension
    );
    const isPdf = extension === "pdf";
    const isDoc = ["docx", "doc", "txt"].includes(extension);

    const renderPreviewContent = () => {
      // Debug information
      const debugInfo = (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-xs">
          <strong>Debug Info:</strong>
          <br />
          File: {selectedFile.filename}
          <br />
          Extension: {extension}
          <br />
          Expected URL: {selectedFile.fileUrl || "Not set"}
          <br />
          Accessible: {selectedFile.isAccessible ? "✅ Yes" : "❌ No"}
          <br />
          {selectedFile.error && `Error: ${selectedFile.error}`}
        </div>
      );

      // If file is not accessible, show error
      if (selectedFile.isAccessible === false) {
        return (
          <div>
            {debugInfo}
            <div className="p-8 text-center space-y-4">
              <File className="w-16 h-16 text-red-400 mx-auto" />
              <div>
                <p className="text-gray-600 font-medium">File Not Accessible</p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFile.error ||
                    "File cannot be loaded from public folder"}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Tried: {selectedFile.fileUrl}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  <p>
                    <strong>Possible solutions:</strong>
                  </p>
                  <ul className="text-left mt-2 space-y-1">
                    <li>• Check if file exists in public folder</li>
                    <li>• Verify file name matches exactly (case-sensitive)</li>
                    <li>• Check browser console for CORS errors</li>
                    <li>
                      • Try accessing file directly:{" "}
                      <a
                        href={selectedFile.fileUrl}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedFile.fileUrl}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // If we don't have fileUrl yet, show loading
      if (!selectedFile.fileUrl) {
        return (
          <div>
            {debugInfo}
            <div className="p-8 text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600">Checking file accessibility...</p>
            </div>
          </div>
        );
      }

      // File is accessible, show appropriate preview
      return (
        <div>
          {debugInfo}
          <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
            {isPdf && (
              <div className="h-96 w-full">
                <iframe
                  src={selectedFile.fileUrl}
                  className="w-full h-full border-0"
                  title={`Preview of ${selectedFile.filename}`}
                  onError={(e) => {
                    console.error("Failed to load PDF:", e);
                  }}
                  onLoad={() => {
                    console.log("PDF loaded successfully");
                  }}
                />
              </div>
            )}

            {isImage && (
              <div className="h-96 w-full flex items-center justify-center">
                <Image
                  src={selectedFile.fileUrl}
                  alt={selectedFile.filename}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.error("Failed to load image:", e);
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully");
                  }}
                />
              </div>
            )}

            {extension === "txt" && (
              <div className="h-96 w-full">
                <iframe
                  src={selectedFile.fileUrl}
                  className="w-full h-full border-0"
                  title={`Preview of ${selectedFile.filename}`}
                />
              </div>
            )}

            {(extension === "docx" || extension === "pptx") && (
              <div className="p-8 text-center space-y-4">
                <FileText className="w-16 h-16 text-orange-400 mx-auto" />
                <div>
                  <p className="text-gray-600 font-medium">
                    Microsoft Office Document
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Browser cannot directly display .{extension} files
                  </p>
                  <div className="mt-4 space-y-2">
                    <a
                      href={selectedFile.fileUrl}
                      download
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </a>
                    <p className="text-xs text-gray-400">
                      Or try:{" "}
                      <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                          window.location.origin + selectedFile.fileUrl
                        )}&embedded=true`}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        Google Docs Viewer
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile.filename)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedFile.filename}
                </h3>
                <p className="text-sm text-gray-500">Print Preview</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Print Settings */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Print Settings</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Color:</span>
                  <span className="ml-2 font-medium capitalize">
                    {selectedFile.settings.color.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Sides:</span>
                  <span className="ml-2 font-medium capitalize">
                    {selectedFile.settings.sides.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Paper Size:</span>
                  <span className="ml-2 font-medium">
                    {selectedFile.settings.paperSize}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Pages per Sheet:</span>
                  <span className="ml-2 font-medium">
                    {selectedFile.settings.pagesPerSheet}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Copies:</span>
                  <span className="ml-2 font-medium">
                    {selectedFile.settings.numberOfCopies}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Pages:</span>
                  <span className="ml-2 font-medium">
                    {selectedFile.settings.pages}
                  </span>
                </div>
              </div>
            </div>

            {/* File Preview Area */}
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Print Request Details
          </h1>
          <p className="text-gray-600">
            Manage and preview your print requests
          </p>
        </div>

        {/* Request Cards */}
        <div className="space-y-6">
          {request.map((req) => (
            <div
              key={req.uniqueId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Request Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Printer className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {req.uniqueId}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(req.time)}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Files List */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Files ({req.files.length})
                </h4>
                <div className="space-y-3">
                  {req.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() => handleFileClick(file, req.uniqueId)}
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.filename)}
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {file.filename}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span className="capitalize">
                              {file.settings.color.replace("_", " ")}
                            </span>
                            <span>{file.settings.paperSize}</span>
                            <span>{file.settings.numberOfCopies} copies</span>
                            <span>Pages: {file.settings.pages}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* File Preview Modal */}
        <FilePreviewModal />
      </div>
    </div>
  );
}
