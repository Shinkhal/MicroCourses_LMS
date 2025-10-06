import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/"); // redirect to home
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex gap-4 items-center">
      <Link to="/admin" className={linkClasses("/admin")}>
        Dashboard
      </Link>
      <Link to="/admin/creators" className={linkClasses("/admin/creators")}>
        Pending Creators
      </Link>
      <Link to="/admin/courses" className={linkClasses("/admin/courses")}>
        Pending Courses
      </Link>
      <button
        onClick={handleLogout}
        className="ml-auto px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
