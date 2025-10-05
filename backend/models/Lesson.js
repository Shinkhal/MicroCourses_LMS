import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String },
    transcript: { type: String },
    order: { type: Number, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
