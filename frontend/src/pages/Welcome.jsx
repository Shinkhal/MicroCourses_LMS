import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to MicroCourses 🎓</h1>
        <p className="text-lg text-gray-200 mb-8 max-w-xl mx-auto">
          A mini LMS where creators upload courses, admins review, and learners
          enroll, learn, and earn certificates with auto-generated transcripts.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/auth"
            className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/auth"
            className="bg-indigo-500 font-semibold px-6 py-3 rounded-xl border border-white hover:bg-indigo-400 transition"
          >
            Register
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-5 text-sm text-gray-300">
        © {new Date().getFullYear()} MicroCourses LMS
      </footer>
    </div>
  );
}
