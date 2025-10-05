// controllers/lessonController.js
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// GET lesson by ID
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course", "title");
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
};

// POST mark lesson as completed
export const markLessonCompleted = async (req, res) => {
  try {
    const { userId } = req.body;
    const lessonId = req.params.id;

    const lesson = await Lesson.findById(lessonId).populate("course");
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: lesson.course._id,
    });

    if (!enrollment)
      return res.status(400).json({ error: "User not enrolled in course" });

    // Calculate progress based on lessons completed
    const course = await Course.findById(lesson.course._id).populate("lessons");
    const totalLessons = course.lessons.length;

    // For simplicity, assume progress increments evenly
    let newProgress = enrollment.progress + Math.floor(100 / totalLessons);
    if (newProgress > 100) newProgress = 100;

    enrollment.progress = newProgress;

    // If 100% done, issue certificate
    if (newProgress === 100 && !enrollment.certificateIssued) {
      enrollment.certificateIssued = true;
      enrollment.certificateHash = Math.random().toString(36).substring(2, 10);
    }

    await enrollment.save();

    res.json({
      message: "Lesson marked as completed",
      progress: enrollment.progress,
      certificateIssued: enrollment.certificateIssued,
      certificateHash: enrollment.certificateHash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark lesson completed" });
  }
};
