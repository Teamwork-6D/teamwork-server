import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Activity must belong to a project'],
    },
    message: {
      type: String,
      required: [true, 'Activity must have a message'],
    },
    task: { type: mongoose.Schema.ObjectId, ref: 'Task' },
    fromColumn: { type: mongoose.Schema.ObjectId, ref: 'Column' },
    toColumn: { type: mongoose.Schema.ObjectId, ref: 'Column' },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An activity must be fired off by a user'],
    },
  },
  { timestamps: true },
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
