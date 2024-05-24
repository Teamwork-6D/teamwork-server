import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task column must have a title'],
    },
    tasksOrder: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Task',
      default: [],
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Task column must belong to a project'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

columnSchema.virtual('tasks', {
  ref: 'Task',
  foreignField: 'columnId',
  localField: '_id',
});


const Column = mongoose.model('Column', columnSchema);
export default Column;
