import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task must have a title'],
    },
    about: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'A task must belong to a project'],
    },
    columnId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Column',
      required: [true, 'A task must belong to a column'],
    },
    users: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
