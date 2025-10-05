import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =============================
   AUTH ROUTES
============================= */
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getUserProfile = () => API.get("/auth/profile");

/* =============================
   CREATOR ROUTES
============================= */
// Apply to become a creator
export const applyAsCreator = () => API.post("/creator/apply");

// Create a new course (approved creators only)
export const createCourse = (data) => API.post("/creator/courses", data);

// Get all creator’s own courses (dashboard)
export const getCreatorCourses = () => API.get("/creator/dashboard");

// Submit a course for admin review
export const submitCourseForReview = (courseId) =>
  API.put(`/creator/courses/${courseId}/submit`);

/* =============================
   COURSES ROUTES (Public)
============================= */
// View all published courses
export const fetchCourses = (params) => API.get("/courses", { params });

// View a single course by ID
export const fetchCourseById = (id) => API.get(`/courses/${id}`);


/* =============================
   ENROLLMENT / PROGRESS ROUTES
============================= */
// Enroll in a course
export const enrollInCourse = (courseId) => API.post("/course/enroll", { courseId });

// Update progress / mark lesson complete
export const updateLessonProgress = (courseId, lessonId) =>
  API.post("/course/progress", { courseId, lessonId });

// Get learner progress for a course
export const getCourseProgress = (courseId) =>
  API.get(`/course/progress/${courseId}`);
