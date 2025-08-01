"use client";
import React, { useState } from "react";
import {
  Mail,
  MessageCircle,
  Phone,
  Clock,
  Rocket,
  Lightbulb,
  FileText,
  Send,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Support",
      description: "support@filexerox.com",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Live Chat",
      description: "Available 24/7 on our platform",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone Support",
      description: "+1 (555) 123-XEROX",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Response Time",
      description: "Within 24 hours",
    },
  ];

  const subjectOptions = [
    { value: "", label: "Select a topic" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Pricing" },
    { value: "feature", label: "Feature Request" },
    { value: "partnership", label: "Partnership Inquiry" },
    { value: "general", label: "General Question" },
  ];

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-5">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-4xl w-full animate-in slide-in-from-bottom-10 duration-800">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-indigo-600">FileXerox</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about our file management platform? We&#39;re here to
            help you streamline your document workflows and boost productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 animate-in fade-in duration-500">
                Thank you for your message! We&#39;ll get back to you within 24
                hours.
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email Address *
                </label>
                <input
                  suppressHydrationWarning
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300"
                >
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 resize-vertical"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Why Choose FileXerox */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-indigo-500 hover:transform hover:translate-x-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Rocket className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Why Choose FileXerox?
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our platform simplifies document management with secure file
                sharing, version control, and seamless collaboration tools
                designed for modern teams.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {method.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500 hover:transform hover:translate-x-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Need Quick Help?
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Check out our comprehensive FAQ section and documentation portal
                for instant answers to common questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
