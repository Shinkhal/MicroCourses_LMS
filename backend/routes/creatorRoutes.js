import express from "express";
import {
  applyCreator,
  createCourse,
  submitCourseForReview,
  getCreatorCourses,
} from "../controllers/creatorController.js";
import { protect, requireApprovedCreator } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------
   @desc    Apply to become a creator
   @route   POST /api/creator/apply
   @access  Private (learner only)
-------------------------------- */
router.post("/apply", protect, applyCreator);

/* --------------------------------
   @desc    Create new course
   @route   POST /api/creator/courses
   @access  Private (approved creators only)
-------------------------------- */
router.post("/courses", protect, requireApprovedCreator, createCourse);

/* --------------------------------
   @desc    Submit course for admin review
   @route   PUT /api/creator/courses/:id/submit
   @access  Private (creator)
-------------------------------- */
router.put("/courses/:id/submit", protect, requireApprovedCreator, submitCourseForReview);

/* --------------------------------
   @desc    Get all creator’s own courses
   @route   GET /api/creator/dashboard
   @access  Private (creator)
-------------------------------- */
router.get("/dashboard", protect, requireApprovedCreator, getCreatorCourses);

export default router;
