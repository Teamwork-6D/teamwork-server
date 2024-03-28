import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project must have a title"],
    },
    cardsOrder: { type: [mongoose.Schema.ObjectId], ref: "Card" },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

const Column = mongoose.model("Column", columnSchema);
export default Column;
