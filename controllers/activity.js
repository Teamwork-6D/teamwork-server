import Activity from '../models/activity';

export async function createActivity(activityData) {
    const {type, projectId, message, task} = activityData;
  
    const newActivity = await Activity.create({  type, projectId, message, task });
  
    return newActivity;
  }

  export async function updateActivity(activityData) {
    const { _id, type, projectId, message, task } = activityData;
  
    const activity = await Activity.findByIdAndUpdate(_id, { type, projectId, message, task });
  
    return activity;
  }

export async function deleteActivity(activityData) {
    const { _id } = activityData;
  
    const activity = await Activity.findByIdAndDelete(_id);
  
    return activity;
}

export async function getAllProjectActivities(projectId) {
    const activities = await Activity.find({ projectId });

    return activities;
}
