import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(true); // true means logged in
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(false);
    navigate("/auth");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
      >
        MicroCourses
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              Hello
            </span>

            <button
              onClick={handleProfile}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
