"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Clock, Phone, Star, Filter, Search } from "lucide-react";

const Shops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const shops = [
    {
      uniqueId: "XC1001",
      shopName: "Smart Print Solutions",
      address: {
        street: "123 Nehru Road",
        city: "Nagpur",
        state: "Maharashtra",
        pincode: "440001",
      },
      openingHours: {
        startTime: "09:00 AM",
        endTime: "08:00 PM",
        closedDays: ["Sunday"],
      },
      servicesAvailable: [
        "Black & White Printing",
        "Color Printing",
        "Scanning",
        "Lamination",
        "Binding",
      ],
      mapLocation: {
        latitude: 21.1458,
        longitude: 79.0882,
      },
    },
    {
      uniqueId: "XC1002",
      shopName: "Perfect Copies",
      address: {
        street: "56 MG Road",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
      },
      openingHours: {
        startTime: "10:00 AM",
        endTime: "07:00 PM",
        closedDays: ["Saturday", "Sunday"],
      },
      servicesAvailable: [
        "Black & White Printing",
        "Photo Printing",
        "Scanning",
        "Document Editing",
      ],
      mapLocation: {
        latitude: 18.5204,
        longitude: 73.8567,
      },
    },
    {
      uniqueId: "XC1003",
      shopName: "Express Print Hub",
      address: {
        street: "12 Park Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      },
      openingHours: {
        startTime: "08:00 AM",
        endTime: "09:00 PM",
        closedDays: [],
      },
      servicesAvailable: [
        "Color Printing",
        "Binding",
        "Photo Printing",
        "Lamination",
      ],
      mapLocation: {
        latitude: 19.076,
        longitude: 72.8777,
      },
    },
    {
      uniqueId: "XC1004",
      shopName: "Green Xerox Point",
      address: {
        street: "Opposite Main Market",
        city: "Nashik",
        state: "Maharashtra",
        pincode: "422001",
      },
      openingHours: {
        startTime: "10:00 AM",
        endTime: "06:00 PM",
        closedDays: ["Monday"],
      },
      servicesAvailable: [
        "Scanning",
        "Black & White Printing",
        "Document Editing",
      ],
      mapLocation: {
        latitude: 19.9975,
        longitude: 73.7898,
      },
    },
  ];

  // Get unique cities and services for filters
  const cities = [...new Set(shops.map((shop) => shop.address.city))];
  const allServices = [
    ...new Set(shops.flatMap((shop) => shop.servicesAvailable)),
  ];

  // Filter shops based on search and filters
  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || shop.address.city === selectedCity;
    const matchesService =
      !selectedService || shop.servicesAvailable.includes(selectedService);

    return matchesSearch && matchesCity && matchesService;
  });

  const isOpen = (shop) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
    return !shop.openingHours.closedDays.includes(currentDay);
  };

  const getStatusColor = (shop) => {
    return isOpen(shop) ? "text-green-600" : "text-red-600";
  };

  const getStatusText = (shop) => {
    return isOpen(shop) ? "Open" : "Closed";
  };

  const handleGetDirections = (shop) => {
    const { latitude, longitude } = shop.mapLocation;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  const fetchFullAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();

      if (data && data.address) {
        setAddress(data.address);
        setSelectedCity(
          data.address.city ||
            data.address.town ||
            data.address.village ||
            "N/A"
        );
      } else {
        setError("Address not found.");
      }
    } catch (err) {
      setError("Failed to fetch address.");
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          fetchFullAddress(lat, lng);
        },
        (err) => {
          setError("Permission denied or location unavailable.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Print & Copy Shops
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Find the perfect printing solution near you
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shops or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-40"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48"
              >
                <option value="">All Services</option>
                {allServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.uniqueId} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                {/* Shop Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-200 transition-colors">
                        {shop.shopName}
                      </h3>
                      <div className="flex items-center text-sm opacity-90">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{shop.address.city}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            isOpen(shop) ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-sm font-medium">
                          {getStatusText(shop)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm opacity-90">
                        <Star className="w-4 h-4 mr-1 fill-current text-yellow-300" />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Details */}
                <div className="p-6 space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p>{shop.address.street}</p>
                      <p>
                        {shop.address.city}, {shop.address.state} -{" "}
                        {shop.address.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">
                        {shop.openingHours.startTime} -{" "}
                        {shop.openingHours.endTime}
                      </p>
                      {shop.openingHours.closedDays.length > 0 && (
                        <p className="text-red-500">
                          Closed: {shop.openingHours.closedDays.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Services Available:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {shop.servicesAvailable.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-colors"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-100">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium transform hover:scale-105">
                      View Details
                    </button>
                    <button
                      onClick={() => handleGetDirections(shop)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No shops found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">{shops.length}</div>
              <div className="text-sm opacity-90">Total Shops</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{cities.length}</div>
              <div className="text-sm opacity-90">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{allServices.length}</div>
              <div className="text-sm opacity-90">Services Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shops;
