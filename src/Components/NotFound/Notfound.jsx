import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiHome, HiArrowLeft } from 'react-icons/hi';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-gray-100 flex flex-col items-center">
        
        {/* Animated / Modern 404 Badge */}
        <div className="relative mb-6">
          <span className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 select-none">
            404
          </span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
            Page Not Found
          </div>
        </div>

        {/* Text Details */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Oops! Lost in Space?
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you are looking for doesn't exist, was removed, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-slate-700 font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all text-sm"
          >
            <HiArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to="/home"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all text-sm"
          >
            <HiHome className="w-4 h-4" />
            Home Feed
          </Link>
        </div>

      </div>
    </div>
  );
}
