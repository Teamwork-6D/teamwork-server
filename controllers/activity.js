// controllers/column,project, auth ,task
// routes/task
import Activity from '../models/activity.js';

export async function createActivity(activityData) {
  const { projectId, message, task, fromColumn, toColumn, user } = activityData;

  const newActivity = await Activity.create({ projectId, message, task, fromColumn, toColumn, user });

  return newActivity;
}

export async function updateActivity(activityData) {
  const { _id, projectId, message, task, fromColumn, toColumn } = activityData;

  const activity = await Activity.findByIdAndUpdate(_id, { projectId, message, task, fromColumn, toColumn });

  return activity;
}

export async function deleteActivity(activityData) {
  const { _id } = activityData;

  const activity = await Activity.findByIdAndDelete(_id);

  return activity;
}

export async function getAllProjectActivities(req, res) {
  try {
    const { projectid } = req.headers;
    const activities = await Activity.find({ projectId: projectid });

    res.status(200).json({
      status: 'success',
      activities,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Unable to fetch activities',
    });
  }
}
