import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import crypto from "crypto";

/* --------------------------------
   @desc    Enroll in a course
   @route   POST /api/enroll
   @access  Private (learner)
-------------------------------- */
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: "courseId",
          message: "courseId is required",
        },
      });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.published) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: "courseId", message: "Course not found or not published" },
      });
    }

    // Check if already enrolled
    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      return res.status(400).json({
        error: { code: "ALREADY_ENROLLED", field: null, message: "You are already enrolled in this course" },
      });
    }

    enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      progress: 0,
      completedLessons: [],
      certificateIssued: false,
    });

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Update progress (mark lesson complete)
   @route   POST /api/progress
   @access  Private (learner)
-------------------------------- */
export const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user.id;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        error: { code: "FIELD_REQUIRED", field: "courseId/lessonId", message: "courseId and lessonId are required" },
      });
    }

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId }).populate("course");
    if (!enrollment) {
      return res.status(404).json({
        error: { code: "NOT_ENROLLED", field: "courseId", message: "You are not enrolled in this course" },
      });
    }

    // Avoid duplicate lessons
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Calculate progress
    const totalLessons = enrollment.course.lessons.length;
    enrollment.progress = Math.floor((enrollment.completedLessons.length / totalLessons) * 100);

    // Auto-issue certificate if completed
    if (enrollment.progress === 100 && !enrollment.certificateIssued) {
      enrollment.certificateIssued = true;
      enrollment.certificateHash = crypto.randomUUID();
    }

    await enrollment.save();

    res.json({
      message: "Progress updated",
      progress: enrollment.progress,
      certificateIssued: enrollment.certificateIssued,
      certificateHash: enrollment.certificateHash || null,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Get learner progress for a course
   @route   GET /api/progress/:courseId
   @access  Private (learner)
-------------------------------- */
export const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId }).populate("course");
    if (!enrollment) {
      return res.status(404).json({
        error: { code: "NOT_ENROLLED", field: "courseId", message: "You are not enrolled in this course" },
      });
    }

    res.json({
      courseId: enrollment.course._id,
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      certificateIssued: enrollment.certificateIssued,
      certificateHash: enrollment.certificateHash || null,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

