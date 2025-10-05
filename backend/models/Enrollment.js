import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    certificateIssued: { type: Boolean, default: false },
    certificateHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
