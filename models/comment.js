import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'comment must have a body'],
    },
    taskId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
      required: [true, 'Comment must belong to a task'],
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'comment must belong to a project'],
    },
  },
  { timestamps: true },
);

const Column = mongoose.model('Column', commentSchema);
export default Column;
