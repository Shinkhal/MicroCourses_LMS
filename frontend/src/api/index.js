import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ====== AUTH ROUTES ======
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// ====== LEARNER ROUTES ======
export const fetchCourses = () => API.get("/courses");
export const fetchCourseById = (id) => API.get(`/courses/${id}`);
export const enrollCourse = (courseId, userId) =>
  API.post(`/courses/${courseId}/enroll`, { userId });
export const updateProgress = (lessonId, userId, progress) =>
  API.post(`/lessons/${lessonId}/progress`, { userId, progress });
export const getCertificate = (courseId, userId) =>
  API.get(`/courses/${courseId}/certificate/${userId}`);

// ====== CREATOR ROUTES ======
export const applyAsCreator = (data) => API.post("/creator/apply", data);
export const createCourse = (data) => API.post("/creator/course", data);
export const updateCourse = (id, data) => API.put(`/creator/course/${id}`, data);
export const deleteCourse = (id) => API.delete(`/creator/course/${id}`);
export const getCreatorCourses = (creatorId) =>
  API.get(`/creator/${creatorId}/courses`);

// ====== LESSON ROUTES ======
export const addLesson = (courseId, data) =>
  API.post(`/creator/course/${courseId}/lesson`, data);
export const getLessons = (courseId) =>
  API.get(`/courses/${courseId}/lessons`);
export const getLessonById = (lessonId) =>
  API.get(`/lessons/${lessonId}`);

// ====== ADMIN ROUTES ======
export const reviewCourses = () => API.get("/admin/review/courses");
export const approveCourse = (id) => API.post(`/admin/course/${id}/approve`);
export const rejectCourse = (id) => API.post(`/admin/course/${id}/reject`);
