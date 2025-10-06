import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

import Welcome from "./pages/Welcome";
import AuthPage from "./pages/Auth";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPage from "./pages/LessonsPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ApplyCreator from "./pages/ApplyCreator";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreateCourse from "./pages/CreateCourse";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingCreators from "./pages/admin/PendingCreators";
import PendingCourses from "./pages/admin/PendingCourses";
import UpdateCourse from "./pages/UpdateCourse";



function App() {
  return (
    <Router>
      {/* All your routes */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/creator/apply" element={<ApplyCreator/>}/>
        <Route path="/creator/dashboard" element={<CreatorDashboard/>}/>
        <Route path="/creator/create-course" element={<CreateCourse />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/creators" element={<PendingCreators />} />
        <Route path="/admin/courses" element={<PendingCourses />} />
        <Route path="/creator/courses/:id" element={<UpdateCourse />} />

      </Routes>

      {/* ✅ Toast Container at Root Level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" // Use "dark" or "light" if you prefer
      />
    </Router>
  );
}

export default App;
