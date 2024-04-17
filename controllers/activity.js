import Activity from '../models/activity';

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
    const { projectId } = req.body;
    const activities = await Activity.find({ projectId });

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
