import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import AuthPage from "./pages/Auth";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPage from "./pages/LessonsPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";


function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="courses/:id/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/profile" element={<Profile/>}/>
          </Routes>
    </Router>
  );
}

export default App;
