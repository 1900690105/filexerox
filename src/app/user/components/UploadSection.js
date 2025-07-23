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

// Toast Component
function Toast({ show, message, type, onClose }) {
  if (!show) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      default:
        return "bg-blue-500 text-white border-blue-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getToastStyles()}`}
      >
        {getIcon()}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function UploadSection({ isDragOver, setIsDragOver }) {
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

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      showToast("Please select files to upload", "warning");
      return;
    }

    if (!printingOptions.xeroxCenterCode.trim()) {
      showToast("Please enter a xerox center code", "error");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/failure for demonstration
      const uploadSuccess = Math.random() > 0.3; // 70% success rate

      if (uploadSuccess) {
        let newUploads;
        if (setting) {
          newUploads = files.map((file) => ({
            name: file.name,
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            type: file.name.split(".").pop().toUpperCase(),
            printingOptions: { ...printingOptions },
          }));
        } else {
          newUploads = files.map((file) => ({
            name: file.name,
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            type: file.name.split(".").pop().toUpperCase(),
          }));
        }

        setFiles([]);
        showToast(
          `Successfully uploaded ${newUploads.length} file${
            newUploads.length > 1 ? "s" : ""
          } for printing!`,
          "success"
        );
        console.log("Files uploaded successfully:", newUploads);
      } else {
        // Simulate upload failure
        throw new Error("Upload failed");
      }
    } catch (error) {
      showToast(
        "Upload declined. Please check your files and connection, then try again.",
        "error"
      );
      console.error("Upload error:", error);
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

    // Validate file types
    const validTypes = [".pdf", ".doc", ".docx"];
    const invalidFiles = droppedFiles.filter((file) => {
      const extension = "." + file.name.split(".").pop().toLowerCase();
      return !validTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      showToast(
        `Invalid file type(s). Only PDF, DOC, and DOCX files are allowed.`,
        "error"
      );
      return;
    }

    // Validate file sizes (30MB limit)
    const oversizedFiles = droppedFiles.filter(
      (file) => file.size > 30 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      showToast(
        `Some files exceed the 10MB limit. Please select smaller files.`,
        "error"
      );
      return;
    }

    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      showToast(
        `${droppedFiles.length} file${
          droppedFiles.length > 1 ? "s" : ""
        } selected successfully!`,
        "success"
      );
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate file types
    const validTypes = [".pdf", ".doc", ".docx"];
    const invalidFiles = selectedFiles.filter((file) => {
      const extension = "." + file.name.split(".").pop().toLowerCase();
      return !validTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      showToast(
        `Invalid file type(s). Only PDF, DOC, and DOCX files are allowed.`,
        "error"
      );
      return;
    }

    // Validate file sizes (30MB limit)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 30 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      showToast(
        `Some files exceed the 30MB limit. Please select smaller files.`,
        "error"
      );
      return;
    }

    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      showToast(
        `${selectedFiles.length} file${
          selectedFiles.length > 1 ? "s" : ""
        } selected successfully!`,
        "success"
      );
    }
  };

  const removeFile = (index) => {
    const removedFile = files[index];
    setFiles(files.filter((_, i) => i !== index));
    showToast(`Removed ${removedFile.name}`, "warning");
  };

  const handlePrintingOptionChange = (field, value) => {
    setPrintingOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      {/* Toast Component */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <div
        className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
        role="form"
        aria-label="Upload Files Form"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <span>Upload Your Files</span>
        </h2>

        <div className="space-y-6">
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
            tabIndex={0}
            role="region"
            aria-label="File Upload Dropzone"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                document.getElementById("file-upload-input").click();
              }
            }}
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
                          aria-label={`Remove file ${file.name}`}
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
                    Drop your files here or press Enter to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX files up to 30MB each • Select
                    multiple files
                  </p>
                </div>
              )}
            </div>

            <input
              id="file-upload-input"
              type="file"
              onChange={handleFileChange}
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx"
              aria-hidden="true"
            />
          </div>

          <div>
            <label
              htmlFor="xerox-code-input"
              className="text-sm font-medium text-gray-700 flex items-center space-x-2 mb-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Xerox Center Code</span>
            </label>
            <input
              id="xerox-code-input"
              type="text"
              placeholder="Enter center code"
              value={printingOptions.xeroxCenterCode}
              onChange={(e) =>
                handlePrintingOptionChange("xeroxCenterCode", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="border p-2 w-44 rounded-md">
            <button
              onClick={() => {
                setSetting(!setting);
              }}
              className="flex gap-2 cursor-pointer items-center"
              aria-pressed={setting}
              aria-label="Toggle print settings"
            >
              <Settings className="w-4 h-4" />
              <span>Print Settings</span>
            </button>
          </div>

          {/* Print Settings Section - you can expand this if needed */}
          {setting && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600">
                Print settings panel can be expanded here...
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 relative ${
              files.length > 0 && !isUploading
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-disabled={files.length === 0 || isUploading}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : files.length > 0 ? (
              `Upload ${files.length} file${
                files.length > 1 ? "s" : ""
              } for printing`
            ) : (
              "Select files to upload"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default UploadSection;

// "use client";
// import {
//   Upload,
//   Printer,
//   Copy,
//   Building2,
//   CheckCircle,
//   XCircle,
//   X,
//   Settings,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";

// function UploadSection({ isDragOver, setIsDragOver }) {
//   const [files, setFiles] = useState([]);
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });
//   const [isUploading, setIsUploading] = useState(false);
//   const [setting, setSetting] = useState(false);
//   const [printingOptions, setPrintingOptions] = useState({
//     pages: "all",
//     pageRange: "",
//     copies: 1,
//     colorMode: "bw",
//     sided: "single",
//     pagePerSheet: "1",
//     xeroxCenterCode: "",
//   });

//   const showToast = (message, type) => {
//     setToast({ show: true, message, type });
//   };

//   const hideToast = () => {
//     setToast({ show: false, message: "", type: "" });
//   };

//   useEffect(() => {
//     if (toast.show) {
//       const timer = setTimeout(() => {
//         hideToast();
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast.show]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) return;

//     if (!printingOptions.xeroxCenterCode.trim()) {
//       showToast("Please enter a xerox center code", "error");
//       return;
//     }

//     setIsUploading(true);

//     try {
//       let newUploads;
//       if (setting) {
//         newUploads = files.map((file) => ({
//           name: file.name,
//           date: new Date().toISOString().split("T")[0],
//           status: "Pending",
//           size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
//           type: file.name.split(".").pop().toUpperCase(),
//           printingOptions: { ...printingOptions },
//         }));
//       } else {
//         newUploads = files.map((file) => ({
//           name: file.name,
//           date: new Date().toISOString().split("T")[0],
//           status: "Pending",
//           size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
//           type: file.name.split(".").pop().toUpperCase(),
//         }));
//       }

//       setFiles([]);
//       showToast(
//         `${files.length} file${
//           files.length > 1 ? "s" : ""
//         } uploaded successfully!`,
//         "success"
//       );
//       console.log("Files uploaded successfully:", newUploads);
//     } catch (error) {
//       showToast(
//         "Upload failed. Please check your connection and try again.",
//         "error"
//       );
//       console.error("Upload error:", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     if (droppedFiles.length > 0) {
//       setFiles(droppedFiles);
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//   };

//   const removeFile = (index) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   const handlePrintingOptionChange = (field, value) => {
//     setPrintingOptions((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   return (
//     <div
//       className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
//       role="form"
//       aria-label="Upload Files Form"
//     >
//       <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
//         <Upload className="w-5 h-5 text-blue-600" />
//         <span>Upload Your Files</span>
//       </h2>

//       <div className="space-y-6">
//         <div
//           className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
//             isDragOver
//               ? "border-blue-400 bg-blue-50"
//               : files.length > 0
//               ? "border-green-400 bg-green-50"
//               : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
//           }`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           tabIndex={0}
//           role="region"
//           aria-label="File Upload Dropzone"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               document.getElementById("file-upload-input").click();
//             }
//           }}
//         >
//           <div className="space-y-4">
//             <div
//               className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
//                 files.length > 0 ? "bg-green-100" : "bg-gray-100"
//               }`}
//             >
//               <Upload
//                 className={`w-8 h-8 ${
//                   files.length > 0 ? "text-green-600" : "text-gray-400"
//                 }`}
//               />
//             </div>

//             {files.length > 0 ? (
//               <div className="space-y-2">
//                 <p className="text-lg font-medium text-green-800">
//                   {files.length} file{files.length > 1 ? "s" : ""} selected
//                 </p>
//                 <div className="max-h-32 overflow-y-auto space-y-1">
//                   {files.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-white rounded-lg p-2 text-sm"
//                     >
//                       <span className="text-green-700 truncate flex-1">
//                         {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
//                       </span>
//                       <button
//                         onClick={() => removeFile(index)}
//                         className="text-red-500 hover:text-red-700 ml-2 text-xs"
//                         aria-label={`Remove file ${file.name}`}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <p className="text-lg font-medium text-gray-700">
//                   Drop your files here or press Enter to browse
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Supports PDF, DOC, DOCX files up to 10MB each • Select
//                   multiple files
//                 </p>
//               </div>
//             )}
//           </div>

//           <input
//             id="file-upload-input"
//             type="file"
//             onChange={handleFileChange}
//             multiple
//             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//             accept=".pdf,.doc,.docx"
//             aria-hidden="true"
//           />
//         </div>

//         <label
//           htmlFor="xerox-code-input"
//           className="text-sm font-medium text-gray-700 flex items-center space-x-2"
//         >
//           <Building2 className="w-4 h-4" />
//           <span>Xerox Center Code</span>
//         </label>
//         <input
//           id="xerox-code-input"
//           type="text"
//           placeholder="Enter center code"
//           value={printingOptions.xeroxCenterCode}
//           onChange={(e) =>
//             handlePrintingOptionChange("xeroxCenterCode", e.target.value)
//           }
//           className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         />

//         <div className=" border p-2 w-44">
//           <button
//             onClick={() => {
//               setSetting(!setting);
//             }}
//             className="flex gap-2 cursor-pointer"
//             aria-pressed={setting}
//             aria-label="Toggle print settings"
//           >
//             <Settings />
//             <span>Print Settings</span>
//           </button>
//         </div>

//         {/* Printing options section remains the same */}

//         <button
//           type="button"
//           onClick={handleUpload}
//           disabled={files.length === 0}
//           className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
//             files.length > 0
//               ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
//               : "bg-gray-200 text-gray-400 cursor-not-allowed"
//           }`}
//           aria-disabled={files.length === 0}
//         >
//           {files.length > 0
//             ? `Upload ${files.length} file${
//                 files.length > 1 ? "s" : ""
//               } for printing`
//             : "Select files to upload"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UploadSection;
