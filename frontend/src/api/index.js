import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://microcourses-lms-tq2l.onrender.com";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
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
export const applyAsCreator = () => API.post("/creator/apply");
export const createCourse = (data) => API.post("/creator/courses", data);
export const getCreatorCourses = () => API.get("/creator/dashboard");
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);

export const submitCourseForReview = (courseId) =>
  API.put(`/creator/courses/${courseId}/submit`);

/* =============================
   COURSES ROUTES (Public)
============================= */
export const fetchCourses = (params) => API.get("/courses", { params });
export const fetchCourseById = (id) => API.get(`/courses/${id}`);

/* =============================
   ENROLLMENT / PROGRESS ROUTES
============================= */
export const enrollInCourse = (courseId) =>
  API.post("/course/enroll", { courseId });

export const updateLessonProgress = (courseId, lessonId) =>
  API.post("/course/progress", { courseId, lessonId });

export const getCourseProgress = (courseId) =>
  API.get(`/course/progress/${courseId}`);

export const getLessonById = (lessonId) => API.get(`/lessons/${lessonId}`);

/* =============================
   ADMIN ROUTES
============================= */
export const getPendingCreators = () =>
  API.get("/admin/creators/pending");

export const updateCreatorStatus = (id, status) =>
  API.put(`/admin/creators/${id}/status`, { status });

export const getPendingCourses = () =>
  API.get("/admin/courses/pending");

export const updateCourseStatus = (id, status) =>
  API.put(`/admin/courses/${id}/status`, { status });
