import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Oops! Page not found.</p>
      <Link
        to="/"
        className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
