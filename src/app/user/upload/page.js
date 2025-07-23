"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Navbar } from "../../components/NavBar";
import UploadSection from "../components/UploadSection";

export default function Dashboard() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState([
    {
      name: "mark.pdf",
      date: "2025-07-22",
      status: "Pending",
      size: "2.4 MB",
      type: "PDF",
    },
    {
      name: "mark.pdf",
      date: "2025-07-21",
      status: "Printed",
      size: "1.2 MB",
      type: "DOCX",
    },
    {
      name: "mark.pdf",
      date: "2025-07-20",
      status: "Rejected",
      size: "3.1 MB",
      type: "PDF",
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Printed":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
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
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const pendingCount = uploads.filter((u) => u.status === "Pending").length;
  const printedCount = uploads.filter((u) => u.status === "Printed").length;
  const rejectedCount = uploads.filter((u) => u.status === "Rejected").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 mt-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Printed</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {printedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {rejectedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <UploadSection isDragOver={isDragOver} setIsDragOver={setIsDragOver} />
      </div>
    </main>
  );
}
