import Task from '../models/task.js';
import Column from '../models/column.js';
import { createActivity } from './activity.js';

export async function createTask(taskData) {
  const { title, about, projectId, dueDate, columnId, user } = taskData;

  const newTask = await Task.create({
    title,
    about,
    projectId,
    dueDate,
    columnId,
  });

  const activityData = {
    projectId,
    message: `'${user.fullName}' added a new task '${newTask.title}'`,
    fromColumn: columnId,
    user: user.id,
  };
  await createActivity(activityData);

  return newTask;
}

export async function updateTask(taskData) {
  const { _id, title, about, dueDate } = taskData;

  const task = await Task.findByIdAndUpdate(_id, { title, about, dueDate });

  return task;
}

export async function deleteTask(taskData) {
  const { _id } = taskData;

  const task = await Task.findByIdAndDelete(_id);
  await Column.findByIdAndUpdate(task.columnId, {
    $pull: { tasksOrder: task._id },
  });

  return task;
}

// req res cycle
export async function getAllProjectTasks(req, res) {
  try {
    const { projectId } = req.body;

    const tasks = await Task.find({ projectId });

    res.status(200).json({
      status: 'success',
      tasks,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Unable to fetch project tasks',
    });
  }
}

export async function addUserToTask(req, res) {
  try {
    const { taskId, userId } = req.body;

    const tasks = await Task.findByIdAndUpdate(
      taskId,
      {
        $addToSet: { users: userId },
      },
      { new: true },
    );

    res.status(200).json({
      status: 'success',
      tasks,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Unable to add user to task',
    });
  }
}

export async function removeUserFromTask(req, res) {
  try {
    const { taskId, userId } = req.body;

    const tasks = await Task.findByIdAndUpdate(
      taskId,
      {
        $pull: { users: userId },
      },
      { new: true },
    );

    res.status(200).json({
      status: 'success',
      tasks,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Unable to remove user from task',
    });
  }
}

export async function getTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('users');
    res.status(200).json({
      status: 'success',
      task,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Unable to remove user from project',
    });
  }
}
