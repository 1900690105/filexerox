// app/not-found.tsx
"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Floating elements background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-pink-400/20 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-400/10 rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* 404 with glow effect */}
          <div className="relative mb-6">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-black text-purple-400/20 blur-sm">
              404
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Lost in Space
          </h2>

          {/* Description */}
          <p className="text-purple-200 mb-8 text-lg leading-relaxed">
            Houston, we have a problem! The page you&#39;re looking for has
            drifted into the digital void.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 ease-out">
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Home
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 ease-out"
            >
              Go Back
            </button>
          </div>

          {/* Fun fact */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-purple-300/80">
              💡 Fun fact: The first 404 error was at CERN in 1992
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
