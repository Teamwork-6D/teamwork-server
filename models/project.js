import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project must have a title'],
    },
    members: { type: [mongoose.Schema.ObjectId], ref: 'User' },
    columnsOrder: { type: [mongoose.Schema.ObjectId], ref: 'Column' },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A project must have an owner'],
    },
  },
  { timestamps: true },
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
