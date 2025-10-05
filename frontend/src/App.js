import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import AuthPage from "./pages/Auth";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/courses" element={<Courses />} />
          </Routes>
    </Router>
  );
}

export default App;
