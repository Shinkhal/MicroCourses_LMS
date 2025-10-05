import express from "express";
import {
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesForReview,
  reviewCourse,
} from "../controllers/courseController.js";
import {
  protect,
  authorize,
  requireApprovedCreator,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------
   Public routes (learners can browse)
-------------------------------- */
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

/* --------------------------------
   Creator routes (must be approved creator)
-------------------------------- */
router.put("/:id", protect, requireApprovedCreator, updateCourse);
router.delete("/:id", protect, requireApprovedCreator, deleteCourse);

/* --------------------------------
   Admin routes (review courses)
-------------------------------- */
router.get(
  "/admin/review",
  protect,
  authorize("admin"),
  getCoursesForReview
);

router.put(
  "/admin/review/:id",
  protect,
  authorize("admin"),
  reviewCourse
);

export default router;
