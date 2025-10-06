import Course from "../models/Course.js";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import crypto from "crypto";

/* --------------------------------
   @desc    Get all published courses (learners)
   @route   GET /api/courses
   @access  Public
-------------------------------- */
export const getAllCourses = async (req, res) => {
  try {
    let { limit = 10, offset = 0 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const courses = await Course.find({ published: true })
      .skip(offset)
      .limit(limit)
      .populate("creator", "name email")
      .populate("lessons");

    const nextOffset = offset + courses.length;

    res.json({ items: courses, next_offset: nextOffset });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Get single course by ID
   @route   GET /api/courses/:id
   @access  Public
-------------------------------- */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("creator", "name email")
      .populate("lessons");

    if (!course) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: "courseId", message: "Course not found" },
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Update course (creator)
   @route   PUT /api/courses/:id
   @access  Private (creator)
-------------------------------- */
export const updateCourse = async (req, res) => {
  try {
    const { title, description, lessons } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: "courseId", message: "Course not found" },
      });
    }

    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({
        error: {
          code: "UNAUTHORIZED",
          field: null,
          message: "You can only update your own courses",
        },
      });
    }

    // Update basic fields
    if (title) course.title = title;
    if (description) course.description = description;

    // Handle lessons
    if (lessons && Array.isArray(lessons)) {
      // Optional: remove old lessons to avoid duplicates
      await Lesson.deleteMany({ _id: { $in: course.lessons } });

      // Create new lessons
      const lessonDocs = await Lesson.insertMany(
        lessons.map((lesson, index) => ({
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          transcript: lesson.transcript || "",
          order: lesson.order ?? index + 1,
          course: course._id,
        }))
      );

      // Link lessons to the course
      course.lessons = lessonDocs.map(l => l._id);
    }

    await course.save();

    // Populate for response
    const populatedCourse = await Course.findById(course._id)
      .populate("lessons")
      .populate("creator", "name email");

    res.json({
      message: "Course updated successfully",
      course: populatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Delete course (creator)
   @route   DELETE /api/courses/:id
   @access  Private (creator)
-------------------------------- */
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: "courseId", message: "Course not found" },
      });
    }

    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({
        error: {
          code: "UNAUTHORIZED",
          field: null,
          message: "You can only delete your own courses",
        },
      });
    }

    await course.remove();

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Admin: review courses (filter by status)
   @route   GET /api/admin/review/courses
   @access  Private (admin)
-------------------------------- */
export const getCoursesForReview = async (req, res) => {
  try {
    const { status = "pending" } = req.query;

    const courses = await Course.find({ status })
      .populate("creator", "name email")
      .populate("lessons");

    res.json({ items: courses, count: courses.length });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Admin: approve or reject course
   @route   PUT /api/admin/review/courses/:id
   @access  Private (admin)
-------------------------------- */
export const reviewCourse = async (req, res) => {
  try {
    const { action } = req.body; // "approve" or "reject"
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: "courseId", message: "Course not found" },
      });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        error: { code: "INVALID_ACTION", field: "action", message: "Action must be 'approve' or 'reject'" },
      });
    }

    course.status = action === "approve" ? "approved" : "rejected";
    if (action === "approve") {
      course.published = true;
      course.serialHash = crypto.randomUUID();
    }

    await course.save();

    res.json({ message: `Course ${course.status} successfully`, course });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};
