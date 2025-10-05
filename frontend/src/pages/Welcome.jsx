import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Welcome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleDashboard = () => {
    navigate("/courses"); // Redirect logged-in users to courses/dashboard
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6">
      
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to MicroCourses 🎓
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
          A mini LMS where creators upload courses, admins review, and learners
          enroll, learn, and earn certificates with auto-generated transcripts.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isLoggedIn ? (
            <button
              onClick={handleDashboard}
              className="bg-white text-indigo-700 font-semibold px-8 py-4 rounded-2xl shadow-lg hover:bg-gray-100 transition text-lg"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/auth"
                className="bg-white text-indigo-700 font-semibold px-8 py-4 rounded-2xl shadow-lg hover:bg-gray-100 transition text-lg"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="bg-indigo-500 font-semibold px-8 py-4 rounded-2xl border border-white hover:bg-indigo-400 transition text-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-sm text-indigo-100">
        © {new Date().getFullYear()} MicroCourses LMS
      </footer>

      {/* Optional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <span className="absolute w-72 h-72 bg-purple-400 opacity-30 rounded-full -top-20 -left-20 animate-pulse"></span>
        <span className="absolute w-96 h-96 bg-indigo-400 opacity-20 rounded-full -bottom-40 -right-32 animate-pulse"></span>
      </div>
    </div>
  );
}
