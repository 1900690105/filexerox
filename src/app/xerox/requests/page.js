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

  // Filter and sort requests
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

  // Status configurations
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

  // Statistics
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
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage file processing requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.in_progress}
                </p>
              </div>
              <Play className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by request ID or user ID..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Sort */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="time">Sort by Time</option>
                  <option value="files">Sort by Files</option>
                  <option value="id">Sort by ID</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.uniqueId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {request.uniqueId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">
                          {request.userId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {request.numberOfFiles} files
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatTime(request.time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredRequests.map((request) => (
              <div
                key={request.uniqueId}
                className="border-b border-gray-200 p-4 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {request.uniqueId}
                    </span>
                  </div>
                  <StatusBadge status={request.status} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    {request.userId}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {request.numberOfFiles} files
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      {formatTime(request.time)}
                    </div>
                  </div>
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
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
