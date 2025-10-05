import User from "../models/User.js";
import Course from "../models/Course.js";

/* --------------------------------
   @desc    Get all pending creator applications
   @route   GET /api/admin/creators/pending
   @access  Private (admin only)
-------------------------------- */
export const getPendingCreators = async (req, res) => {
  try {
    const pendingCreators = await User.find({ creatorStatus: "pending" }).select("-password");
    res.json({
      items: pendingCreators,
      count: pendingCreators.length,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Approve or reject a creator application
   @route   PUT /api/admin/creators/:id/status
   @access  Private (admin only)
-------------------------------- */
export const updateCreatorStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: {
          code: "INVALID_STATUS",
          field: "status",
          message: "Status must be either 'approved' or 'rejected'",
        },
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: "userId", message: "User not found" },
      });
    }

    if (user.role !== "creator" && user.role !== "learner") {
      return res.status(400).json({
        error: {
          code: "INVALID_ROLE",
          field: "role",
          message: "User is not eligible for creator role",
        },
      });
    }

    user.creatorStatus = status;
    if (status === "approved") user.role = "creator"; // promote to creator
    await user.save();

    res.json({
      message: `Creator application ${status}`,
      id: user._id,
      name: user.name,
      creatorStatus: user.creatorStatus,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Get all pending courses for review
   @route   GET /api/admin/courses/pending
   @access  Private (admin only)
-------------------------------- */
export const getPendingCourses = async (req, res) => {
  try {
    const pendingCourses = await Course.find({ status: "pending" })
      .populate("creator", "name email");
    res.json({
      items: pendingCourses,
      count: pendingCourses.length,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};

/* --------------------------------
   @desc    Approve or reject a course
   @route   PUT /api/admin/courses/:id/status
   @access  Private (admin only)
-------------------------------- */
export const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: {
          code: "INVALID_STATUS",
          field: "status",
          message: "Status must be either 'approved' or 'rejected'",
        },
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", field: "courseId", message: "Course not found" },
      });
    }

    course.status = status;
    course.published = status === "approved";
    await course.save();

    res.json({
      message: `Course ${status} successfully`,
      id: course._id,
      title: course.title,
      status: course.status,
      published: course.published,
    });
  } catch (error) {
    res.status(500).json({
      error: { code: "SERVER_ERROR", field: null, message: error.message },
    });
  }
};
