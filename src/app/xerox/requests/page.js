"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
} from "lucide-react";

const RequestPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("time");

  const requests = [
    {
      uniqueId: "001",
      userId: "USR-101",
      numberOfFiles: 3,
      time: "2025-07-22T10:45:00Z",
      status: "pending",
    },
    {
      uniqueId: "002",
      userId: "USR-102",
      numberOfFiles: 7,
      time: "2025-07-22T11:15:00Z",
      status: "in_progress",
    },
    {
      uniqueId: "003",
      userId: "USR-103",
      numberOfFiles: 1,
      time: "2025-07-22T11:30:00Z",
      status: "completed",
    },
    {
      uniqueId: "004",
      userId: "USR-104",
      numberOfFiles: 5,
      time: "2025-07-22T11:45:00Z",
      status: "pending",
    },
    {
      uniqueId: "005",
      userId: "USR-105",
      numberOfFiles: 2,
      time: "2025-07-22T12:00:00Z",
      status: "in_progress",
    },
    {
      uniqueId: "006",
      userId: "USR-106",
      numberOfFiles: 4,
      time: "2025-07-22T12:15:00Z",
      status: "completed",
    },
    {
      uniqueId: "007",
      userId: "USR-107",
      numberOfFiles: 9,
      time: "2025-07-22T12:30:00Z",
      status: "pending",
    },
    {
      uniqueId: "008",
      userId: "USR-108",
      numberOfFiles: 6,
      time: "2025-07-22T12:45:00Z",
      status: "cancelled",
    },
    {
      uniqueId: "009",
      userId: "USR-109",
      numberOfFiles: 10,
      time: "2025-07-22T13:00:00Z",
      status: "completed",
    },
    {
      uniqueId: "010",
      userId: "USR-110",
      numberOfFiles: 2,
      time: "2025-07-22T13:15:00Z",
      status: "pending",
    },
  ];

  const filteredRequests = requests
    .filter((req) => {
      const matchesSearch =
        req.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "time") return new Date(b.time) - new Date(a.time);
      if (sortBy === "files") return b.numberOfFiles - a.numberOfFiles;
      return a.uniqueId.localeCompare(b.uniqueId);
    });

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      label: "Pending",
    },
    in_progress: {
      icon: Play,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      label: "In Progress",
    },
    completed: {
      icon: CheckCircle,
      color: "text-green-600 bg-green-50 border-green-200",
      label: "Completed",
    },
    cancelled: {
      icon: XCircle,
      color: "text-red-600 bg-red-50 border-red-200",
      label: "Cancelled",
    },
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
        role="status"
        aria-label={config.label}
      >
        <Icon className="w-3 h-3 mr-1" aria-hidden="true" />
        {config.label}
      </span>
    );
  };

  return (
    <main
      className="min-h-screen bg-gray-50 p-4 md:p-6"
      role="main"
      aria-label="Request Management Page"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Request Management
          </h1>
          <p className="text-gray-600 text-base">
            Monitor and manage file processing requests
          </p>
        </header>

        {/* Stats */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Summary Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: "Total",
                count: stats.total,
                icon: FileText,
                color: "text-gray-500",
              },
              {
                label: "Pending",
                count: stats.pending,
                icon: Clock,
                color: "text-yellow-500",
              },
              {
                label: "In Progress",
                count: stats.in_progress,
                icon: Play,
                color: "text-blue-500",
              },
              {
                label: "Completed",
                count: stats.completed,
                icon: CheckCircle,
                color: "text-green-500",
              },
              {
                label: "Cancelled",
                count: stats.cancelled,
                icon: XCircle,
                color: "text-red-500",
              },
            ].map(({ label, count, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-white rounded-lg p-4 shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p
                      className={`text-2xl font-bold ${color.replace(
                        "text-",
                        ""
                      )}`}
                    >
                      {count}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${color}`} aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">
            Filter and Search
          </h2>
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <label
                className="relative w-full md:w-1/2"
                aria-label="Search Requests"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by request ID or user ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
              <div className="flex gap-2 w-full md:w-auto">
                <label className="sr-only" htmlFor="status-select">
                  Status
                </label>
                <select
                  id="status-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <label className="sr-only" htmlFor="sort-select">
                  Sort By
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="time">Sort by Time</option>
                  <option value="files">Sort by Files</option>
                  <option value="id">Sort by ID</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Request List Table */}
        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="sr-only">
            Request Table
          </h2>
          <div
            className="bg-white rounded-lg shadow-sm border"
            role="table"
            aria-label="Request List Table"
          >
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Request ID</th>
                    <th className="px-6 py-3">User ID</th>
                    <th className="px-6 py-3">Files</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.uniqueId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {req.uniqueId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {req.userId}
                        </span>
                      </td>
                      <td className="px-6 py-4">{req.numberOfFiles} files</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatTime(req.time)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div
              className="md:hidden"
              role="list"
              aria-label="Mobile Request Cards"
            >
              {filteredRequests.map((req) => (
                <div
                  key={req.uniqueId}
                  className="p-4 border-b border-gray-200"
                  role="listitem"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">
                      {req.uniqueId}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <User className="inline w-4 h-4 mr-1 text-gray-400" />
                    {req.userId}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{req.numberOfFiles} files</span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      {formatTime(req.time)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No requests found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default RequestPage;
