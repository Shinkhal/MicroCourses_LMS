import express from "express";
import {
  getPendingCreators,
  updateCreatorStatus,
  getPendingCourses,
  updateCourseStatus,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------
   Admin-only routes
-------------------------------- */
router.get("/creators/pending", protect, authorize("admin"), getPendingCreators);
router.put("/creators/:id/status", protect, authorize("admin"), updateCreatorStatus);

router.get("/courses/pending", protect, authorize("admin"), getPendingCourses);
router.put("/courses/:id/status", protect, authorize("admin"), updateCourseStatus);

export default router;
