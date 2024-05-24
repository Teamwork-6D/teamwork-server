import Column from '../models/column.js';
import Project from '../models/project.js';
import Task from '../models/task.js';
import { createActivity } from './activity.js';

export async function createColumn(columnData) {
  const { title, tasksOrder, projectId, user } = columnData;

  const newColumn = await Column.create({ title, tasksOrder, projectId });
  await Project.findByIdAndUpdate(projectId, {
    $addToSet: { columnsOrder: newColumn._id },
  });
  const activityData = {
    projectId,
    message: `'${user.fullName}' create a new column '${newColumn.title}'`,
    fromColumn: newColumn._id,
    user: user.id,
  };
  await createActivity(activityData);

  return newColumn;
}

export async function updateColumn(columnData) {
  const { _id, title, user, oldColumn } = columnData;

  const column = await Column.findByIdAndUpdate(_id, { title }, { new: true });
  const activityData = {
    projectId: _id,
    message: `'${user.fullName}' edited column title '${oldColumn.title}' -> '${column.title}'`,
    fromColumn: column._id,
    user: user.id,
  };
  await createActivity(activityData);

  return column;
}

export async function deleteColumn(columnData) {
  const { _id, projectId, user } = columnData;

  const column = await Column.findByIdAndDelete(_id);

  await Project.findByIdAndUpdate(projectId, {
    $pull: { columnsOrder: _id },
  });
  await Task.deleteMany({ columnId: column._id });
  const activityData = {
    projectId,
    message: `'${user.fullName}' deleted a column '${column.title}' and all it's data`,
    user: user.id,
  };
  await createActivity(activityData);

  return column;
}

export async function changeColumnsOrder(columnData) {
  const { projectId, columnsOrder } = columnData;

  const project = await Project.findOneAndUpdate(projectId, { columnsOrder });

  return project;
}

export async function getAllProjectColumns(req, res) {
  try {
    const { projectid } = req.headers;
    const columns = await Column.find({ projectId: projectid }).populate('tasks');

    res.status(200).json({
      status: 'success',
      columns,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Unable to fetch activities',
    });
  }
}
