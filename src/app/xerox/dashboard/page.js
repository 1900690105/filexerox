"use client";
import { useState } from "react";
import {
  Upload,
  File,
  Clock,
  CheckCircle,
  XCircle,
  User,
  LogOut,
  Plus,
  FileText,
  Download,
} from "lucide-react";

export default function UserDashboard() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: "Resume.pdf",
      status: "Pending",
      uploadedAt: "2025-07-21",
      size: "2.4 MB",
      type: "pdf",
    },
    {
      id: 2,
      name: "Notes.docx",
      status: "Printed",
      uploadedAt: "2025-07-20",
      size: "1.8 MB",
      type: "docx",
    },
    {
      id: 3,
      name: "Presentation.pptx",
      status: "Rejected",
      uploadedAt: "2025-07-19",
      size: "5.2 MB",
      type: "pptx",
    },
  ]);

  const handleUpload = () => {
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        status: "Pending",
        uploadedAt: new Date().toISOString().split("T")[0],
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        type: file.name.split(".").pop().toLowerCase(),
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      setFile(null);
    }
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Printed":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Printed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getFileIcon = (type) => {
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <File className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  FileXerox
                </h1>
                <p className="text-sm text-gray-500">
                  Print & Document Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">John Doe</span>
              </div>
              <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Files</p>
                <p className="text-3xl font-bold text-gray-900">
                  {uploadedFiles.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Printed</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {uploadedFiles.filter((f) => f.status === "Printed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600">
                  {uploadedFiles.filter((f) => f.status === "Pending").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Files List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Uploaded Files
                </h2>
              </div>

              <div className="overflow-x-auto">
                {uploadedFiles.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          File
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Size
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {uploadedFiles.map((file) => (
                        <tr
                          key={file.id}
                          className="hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.type)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {file.type} file
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                                file.status
                              )}`}
                            >
                              {getStatusIcon(file.status)}
                              {file.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {file.uploadedAt}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {file.size}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      No files uploaded yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Upload your first file to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
