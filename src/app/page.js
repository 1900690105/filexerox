"use client";
import React, { useState, useEffect } from "react";
import {
  Upload,
  MapPin,
  CheckCircle,
  ArrowRight,
  FileText,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { Navbar } from "./components/NavBar";
import HeroSection from "./components/HeroSection";

// Mock Navbar component

const FloatingParticle = ({ delay = 0 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const animate = () => {
      setPosition({
        x: Math.sin(Date.now() * 0.001 + delay) * 20,
        y: Math.cos(Date.now() * 0.0015 + delay) * 15,
      });
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div
      className="absolute w-2 h-2 bg-blue-400/30 rounded-full blur-sm"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

export default function Home() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 text-gray-900 overflow-hidden">
      <Navbar />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            // style={{
            //   left: `${Math.random() * 100}%`,
            //   top: `${Math.random() * 100}%`,
            // }}
          >
            <FloatingParticle delay={i * 0.5} />
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <HeroSection dragActive={dragActive} setDragActive={setDragActive} />

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FileXerox
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of printing with our cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Upload and print in under 60 seconds",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                desc: "Your documents are encrypted and secure",
                color: "from-green-400 to-blue-500",
              },
              {
                icon: Clock,
                title: "24/7 Available",
                desc: "Print anytime at thousands of locations",
                color: "from-purple-400 to-pink-500",
              },
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned */}
      <section
        id="howitworks"
        className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-white">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple. Fast. Reliable.
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Three steps to get your documents printed professionally
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your File",
                desc: "Drag & drop or click to upload. We support all major formats.",
                icon: Upload,
              },
              {
                step: "02",
                title: "Choose Location",
                desc: "Select from thousands of nearby Xerox centers on our map.",
                icon: MapPin,
              },
              {
                step: "03",
                title: "Collect Prints",
                desc: "Get instant confirmation and pickup your documents.",
                icon: CheckCircle,
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-6xl font-black opacity-30">
                      {item.step}
                    </span>
                    <item.icon className="w-12 h-12 opacity-80" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-white/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to revolutionize your printing?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have already made the switch to smart,
            cloud-based printing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              Get Started Free
              <ArrowRight className="inline-block w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500">
              No credit card required • 5 free prints
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FileXerox</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of printing is here. Fast, secure, and always
                available.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Locations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} FileXerox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
