import crypto from "crypto";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";

/* --------------------------------
   @desc    Apply to become a creator
   @route   POST /api/creator/apply
   @access  Private (learner only)
-------------------------------- */
export const applyCreator = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: null, message: "User not found" },
      });
    }

    if (user.creatorStatus !== "none") {
      return res.status(400).json({
        error: {
          code: "CREATOR_ALREADY_APPLIED",
          field: "creatorStatus",
          message: `You already have a creator status: ${user.creatorStatus}`,
        },
      });
    }

    user.creatorStatus = "pending";
    await user.save();

    res.json({
      message: "Creator application submitted successfully",
      creatorStatus: user.creatorStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Create new course (with lessons)
   @route   POST /api/creator/courses
   @access  Private (approved creators only)
-------------------------------- */
export const createCourse = async (req, res) => {
  try {
    const { title, description, lessons } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: "title/description",
          message: "Title and description are required",
        },
      });
    }

    const creator = await User.findById(req.user.id);
    if (!creator || creator.creatorStatus !== "approved") {
      return res.status(403).json({
        error: {
          code: "NOT_APPROVED_CREATOR",
          field: "creatorStatus",
          message: "You must be an approved creator to create a course",
        },
      });
    }

    // Step 1: Generate a unique serialHash for the course
    const serialHash = crypto.randomBytes(8).toString("hex");

    // Step 2: Create the course
    const course = await Course.create({
      title,
      description,
      creator: creator._id,
      status: "pending",
      published: false,
      serialHash,
    });

    // Step 3: If lessons are provided, create them
    if (lessons && lessons.length > 0) {
      const lessonDocs = await Lesson.insertMany(
        lessons.map((lesson, index) => ({
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          transcript: lesson.transcript || "",
          order: lesson.order ?? index + 1,
          course: course._id,
        }))
      );

      // Step 4: Link lessons to the course
      course.lessons = lessonDocs.map((l) => l._id);
      await course.save();
    }

    // Step 5: Return the populated course
    const populatedCourse = await Course.findById(course._id)
      .populate("lessons")
      .populate("creator", "name email");

    res.status(201).json({
      message: "Course created successfully",
      course: populatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Submit course for admin review
   @route   PUT /api/creator/courses/:id/submit
   @access  Private (creator)
-------------------------------- */
export const submitCourseForReview = async (req, res) => {
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
          message: "You can only submit your own courses",
        },
      });
    }

    if (course.status !== "pending") {
      return res.status(400).json({
        error: {
          code: "INVALID_STATUS",
          field: "status",
          message: "Only pending courses can be submitted for review",
        },
      });
    }

    course.status = "under_review"; // optional enum addition later
    await course.save();

    res.json({ message: "Course submitted for admin review" });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Get all creator’s own courses
   @route   GET /api/creator/dashboard
   @access  Private (creator)
-------------------------------- */
export const getCreatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.user.id }).populate("lessons");

    res.json({
      items: courses,
      count: courses.length,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};
