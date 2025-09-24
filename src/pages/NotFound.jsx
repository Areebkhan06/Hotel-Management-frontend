import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* 404 Number */}
      <h1 className="text-7xl md:text-9xl font-extrabold text-indigo-600 tracking-tight">
        404
      </h1>

      {/* Divider */}
      <div className="h-1 w-20 rounded bg-indigo-600 my-6"></div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-base md:text-lg mt-4 text-gray-600 max-w-lg text-center">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4 mt-8">
        <a
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 text-white rounded-lg font-medium shadow-sm active:scale-95 transition-transform"
        >
          Return Home
        </a>
        <a
          href="/contact"
          className="border border-gray-300 px-6 py-2.5 text-gray-700 rounded-lg font-medium hover:bg-gray-100 active:scale-95 transition-transform"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default NotFound;
