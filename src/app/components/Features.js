import { Clock, Shield, Zap } from "lucide-react";
import React from "react";

function Features() {
  return (
    <>
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
    </>
  );
}

export default Features;
