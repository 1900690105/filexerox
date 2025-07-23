"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Printer,
  X,
} from "lucide-react";
import { Navbar } from "../../components/NavBar";
import Image from "next/image";

export default function Dashboard() {
  const [selectedFileForPreview, setSelectedFileForPreview] = useState(null);
  const previewModalRef = useRef(null);

  const [uploads, setUploads] = useState([
    {
      name: "mark.pdf",
      date: "2025-07-22",
      status: "Pending",
      size: "2.4 MB",
      type: "PDF",
      url: "/mark.pdf",
    },
    {
      name: "mark.pdf",
      date: "2025-07-21",
      status: "Printed",
      size: "1.2 MB",
      type: "DOCX",
      url: "/mark.pdf",
    },
    {
      name: "mark.pdf",
      date: "2025-07-20",
      status: "Rejected",
      size: "3.1 MB",
      type: "PDF",
      url: "/mark.pdf",
    },
    {
      name: "mark.pdf",
      date: "2025-07-19",
      status: "Printed",
      size: "800 KB",
      type: "PNG",
      url: "/mark.pdf",
    },
  ]);

  const handleFileClick = (file) => {
    setSelectedFileForPreview(file);
  };

  const handleKeyDown = (e, file) => {
    if (e.key === "Enter") {
      handleFileClick(file);
    }
  };

  const handlePrint = () => {
    const file = selectedFileForPreview;
    if (file && file.url) {
      if (file.type === "PDF") {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = file.url;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow.print();
          document.body.removeChild(iframe);
        };
      } else {
        const win = window.open(file.url, "_blank");
        if (win) win.onload = () => win.print();
        else alert("Enable pop-ups to print.");
      }
    }
  };

  const closeModal = () => {
    setSelectedFileForPreview(null);
  };

  // Escape to close modal
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (selectedFileForPreview) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedFileForPreview]);

  const getStatusIcon = (status) =>
    status === "Printed" ? (
      <CheckCircle className="w-4 h-4" />
    ) : status === "Pending" ? (
      <Clock className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );

  const getStatusColor = (status) =>
    status === "Printed"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : status === "Pending"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-red-100 text-red-800 border-red-200";

  const pendingCount = uploads.filter((u) => u.status === "Pending").length;
  const printedCount = uploads.filter((u) => u.status === "Printed").length;
  const rejectedCount = uploads.filter((u) => u.status === "Rejected").length;

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      role="main"
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 mt-20">
        {/* Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          role="region"
          aria-label="Status Summary"
        >
          {[
            { label: "Pending", count: pendingCount, color: "amber" },
            { label: "Printed", count: printedCount, color: "emerald" },
            { label: "Rejected", count: rejectedCount, color: "red" },
          ].map(({ label, count, color }, i) => (
            <div
              key={i}
              className={`bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all hover:-translate-y-1`}
              aria-label={`${label} count`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className={`text-3xl font-bold text-${color}-600`}>
                    {count}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}
                >
                  {label === "Pending" ? (
                    <Clock className={`w-6 h-6 text-${color}-600`} />
                  ) : label === "Printed" ? (
                    <CheckCircle className={`w-6 h-6 text-${color}-600`} />
                  ) : (
                    <XCircle className={`w-6 h-6 text-${color}-600`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Files List */}
        <section aria-labelledby="file-section-title">
          <h2 id="file-section-title" className="sr-only">
            Uploaded Files
          </h2>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Your Files ({uploads.length})</span>
              </h2>
            </div>

            <div className="divide-y divide-gray-100" role="list">
              {uploads.map((file, idx) => (
                <div
                  key={idx}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, file)}
                  className="p-6 hover:bg-white/50 transition-all duration-200 group outline-none focus:ring-2 focus:ring-blue-300 rounded-sm cursor-pointer"
                  onClick={() => handleFileClick(file)}
                  aria-label={`File ${file.name}, status ${file.status}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {file.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{file.date}</span>
                          </span>
                          <span>{file.size}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                            {file.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor(
                        file.status
                      )}`}
                    >
                      {getStatusIcon(file.status)}
                      <span className="text-sm font-medium">{file.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {uploads.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No files uploaded yet</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modal */}
      {selectedFileForPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={`Previewing ${selectedFileForPreview.name}`}
          ref={previewModalRef}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>Preview: {selectedFileForPreview.name}</span>
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-hidden">
              {selectedFileForPreview.type === "PDF" ? (
                <iframe
                  src={selectedFileForPreview.url}
                  title="File Preview"
                  className="w-full h-full border rounded-md"
                  frameBorder="0"
                ></iframe>
              ) : ["PNG", "JPG", "JPEG", "GIF"].includes(
                  selectedFileForPreview.type
                ) ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Image
                    src={selectedFileForPreview.url}
                    alt="File Preview"
                    className="max-w-full max-h-full object-contain rounded-md"
                    width={800}
                    height={600}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-md text-gray-600 text-center">
                  <p>
                    No direct preview for this file type (
                    {selectedFileForPreview.type}).
                    <br />
                    You can print or download it instead.
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                <Printer className="w-5 h-5 mr-2" />
                Send for Print
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import {
//   FileText,
//   Calendar,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Eye,
//   Printer,
//   X,
// } from "lucide-react";
// import { Navbar } from "../../components/NavBar";
// import Image from "next/image";
// import UploadSection from "@/app/user/components/UploadSection";

// export default function Dashboard() {
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [selectedFileForPreview, setSelectedFileForPreview] = useState(null);

//   const [uploads, setUploads] = useState([
//     {
//       name: "mark.pdf",
//       date: "2025-07-22",
//       status: "Pending",
//       size: "2.4 MB",
//       type: "PDF",
//       url: "/mark.pdf",
//     },
//     {
//       name: "mark.pdf",
//       date: "2025-07-21",
//       status: "Printed",
//       size: "1.2 MB",
//       type: "DOCX",
//       url: "/mark.pdf",
//     },
//     {
//       name: "mark.pdf",
//       date: "2025-07-20",
//       status: "Rejected",
//       size: "3.1 MB",
//       type: "PDF",
//       url: "/mark.pdf",
//     },
//     {
//       name: "mark.pdf",
//       date: "2025-07-19",
//       status: "Printed",
//       size: "800 KB",
//       type: "PNG",
//       url: "/mark.pdf",
//     },
//   ]);

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Printed":
//         return <CheckCircle className="w-4 h-4" />;
//       case "Pending":
//         return <Clock className="w-4 h-4" />;
//       case "Rejected":
//         return <XCircle className="w-4 h-4" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Printed":
//         return "bg-emerald-100 text-emerald-800 border-emerald-200";
//       case "Pending":
//         return "bg-amber-100 text-amber-800 border-amber-200";
//       case "Rejected":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const handleFileClick = (file) => {
//     setSelectedFileForPreview(file);
//   };

//   const handlePrint = () => {
//     if (selectedFileForPreview && selectedFileForPreview.url) {
//       if (selectedFileForPreview.type === "PDF") {
//         const iframe = document.createElement("iframe");
//         iframe.style.display = "none";
//         iframe.src = selectedFileForPreview.url;
//         document.body.appendChild(iframe);
//         iframe.onload = () => {
//           iframe.contentWindow.print();
//           document.body.removeChild(iframe);
//         };
//       } else {
//         const printWindow = window.open(selectedFileForPreview.url, "_blank");
//         if (printWindow) {
//           printWindow.onload = () => {
//             printWindow.print();
//           };
//         } else {
//           alert(
//             "Please allow pop-ups for printing. Or download the file and print manually."
//           );
//         }
//       }
//     } else {
//       alert("No file selected for printing or file URL is missing.");
//     }
//   };

//   const pendingCount = uploads.filter((u) => u.status === "Pending").length;
//   const printedCount = uploads.filter((u) => u.status === "Printed").length;
//   const rejectedCount = uploads.filter((u) => u.status === "Rejected").length;

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header */}
//       <Navbar />

//       <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 mt-20">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Pending</p>
//                 <p className="text-3xl font-bold text-amber-600">
//                   {pendingCount}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
//                 <Clock className="w-6 h-6 text-amber-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Printed</p>
//                 <p className="text-3xl font-bold text-emerald-600">
//                   {printedCount}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 text-emerald-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Rejected</p>
//                 <p className="text-3xl font-bold text-red-600">
//                   {rejectedCount}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                 <XCircle className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Upload Section */}
//         <UploadSection isDragOver={isDragOver} setIsDragOver={setIsDragOver} />

//         {/* Files List */}
//         <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
//               <FileText className="w-5 h-5 text-blue-600" />
//               <span>Your Files ({uploads.length})</span>
//             </h2>
//           </div>

//           <div className="divide-y divide-gray-100">
//             {uploads.map((file, idx) => (
//               <div
//                 key={idx}
//                 className="p-6 hover:bg-white/50 transition-all duration-200 group"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
//                       <FileText className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <div>
//                       {/* Added onClick handler to the file name */}
//                       <h3
//                         className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
//                         onClick={() => handleFileClick(file)}
//                       >
//                         {file.name}
//                       </h3>
//                       <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
//                         <span className="flex items-center space-x-1">
//                           <Calendar className="w-3 h-3" />
//                           <span>{file.date}</span>
//                         </span>
//                         <span>{file.size}</span>
//                         <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
//                           {file.type}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor(
//                       file.status
//                     )}`}
//                   >
//                     {getStatusIcon(file.status)}
//                     <span className="text-sm font-medium">{file.status}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {uploads.length === 0 && (
//             <div className="p-12 text-center text-gray-500">
//               <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
//               <p>No files uploaded yet</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* File Preview Modal */}
//       {selectedFileForPreview && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
//                 <Eye className="w-5 h-5 text-blue-600" />
//                 <span>Preview: {selectedFileForPreview.name}</span>
//               </h2>
//               <button
//                 onClick={() => setSelectedFileForPreview(null)}
//                 className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
//                 aria-label="Close preview"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex-grow p-4 overflow-hidden">
//               {selectedFileForPreview.type === "PDF" ? (
//                 <iframe
//                   src={selectedFileForPreview.url}
//                   title="File Preview"
//                   className="w-full h-full border rounded-md"
//                   frameBorder="0"
//                 ></iframe>
//               ) : selectedFileForPreview.type === "PNG" ||
//                 selectedFileForPreview.type === "JPG" ||
//                 selectedFileForPreview.type === "JPEG" ||
//                 selectedFileForPreview.type === "GIF" ? (
//                 <div className="flex items-center justify-center w-full h-full">
//                   <Image
//                     src={`/${selectedFileForPreview.url}`}
//                     alt="File Preview"
//                     className="max-w-full max-h-full object-contain rounded-md"
//                   />
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-full bg-gray-50 rounded-md text-gray-600 text-center">
//                   <p>
//                     No direct preview available for this file type (
//                     {selectedFileForPreview.type}).
//                     <br />
//                     You can try to print it, or download it to view.
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="p-4 border-t border-gray-200 flex justify-end">
//               <button
//                 onClick={handlePrint}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md"
//               >
//                 <Printer className="w-5 h-5 mr-2" />
//                 Send for Print
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
