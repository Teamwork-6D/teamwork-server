import Task from '../models/task';

export async function createTask(taskData) {
  const { title, body, projectId, columnId } = taskData;

  const newTask = await Task.create({ title, body, projectId, columnId });

  return newTask;
}

export async function updateTask(taskData) {
  const { _id, title, body, projectId, columnId } = taskData;

  const task = await Task.findByIdAndUpdate(_id, { title, body, projectId, columnId });

  return task;
}

export async function deleteTask(taskData) {
  const { _id } = taskData;

  const task = await Task.findByIdAndDelete(_id);

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
    resizeBy.status(400).json({
      status: 'failure',
      message: 'Unable to fetch project tasks',
    });
  }
}
