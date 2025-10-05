import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    published: { type: Boolean, default: false },
    serialHash: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
