"use client";
import { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  FileText,
  MoreVertical,
  Edit3,
} from "lucide-react";
import { Navbar } from "@/app/components/NavBar";

export default function UserDashboard() {
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

  const [editingFile, setEditingFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  const statusOptions = ["Pending", "Printed", "Rejected"];

  const updateFileStatus = (fileId, newStatus) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, status: newStatus } : file
      )
    );
    setEditingFile(null);
    setShowDropdown(null);
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
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 mt-16">
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
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
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
                            {editingFile === file.id ? (
                              <select
                                value={file.status}
                                onChange={(e) =>
                                  updateFileStatus(file.id, e.target.value)
                                }
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                onBlur={() => setEditingFile(null)}
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <button
                                onClick={() => setEditingFile(file.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                                  file.status
                                )} hover:shadow-md transition-all duration-200 group`}
                              >
                                {getStatusIcon(file.status)}
                                {file.status}
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {file.uploadedAt}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {file.size}
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowDropdown(
                                    showDropdown === file.id ? null : file.id
                                  )
                                }
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                              </button>

                              {showDropdown === file.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                                  <div className="p-2">
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                                      Change Status
                                    </div>
                                    {statusOptions.map((status) => (
                                      <button
                                        key={status}
                                        onClick={() =>
                                          updateFileStatus(file.id, status)
                                        }
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 ${
                                          file.status === status
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {getStatusIcon(status)}
                                        {status}
                                        {file.status === status && (
                                          <CheckCircle className="w-3 h-3 ml-auto" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
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
