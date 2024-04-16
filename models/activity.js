import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Activity must have a type'],
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Activity must belong to a project'],
    },
    task: { type: mongoose.Schema.ObjectId, ref: 'Task' },
    fromColumn: { type: mongoose.Schema.ObjectId, ref: 'Column' },
    toColumn: { type: mongoose.Schema.ObjectId, ref: 'Column' },
  },
  { timestamps: true },
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
