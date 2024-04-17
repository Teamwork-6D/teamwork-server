import Column from '../models/column';
import Project from '../models/project';

export async function createColumn(columnData) {
  const { title, tasksOrder, projectId } = columnData;

  const newColumn = await Column.create({ title, tasksOrder, projectId });

  return newColumn;
}

export async function updateColumn(columnData) {
  const { _id, title, tasksOrder, projectId } = columnData;

  const column = await Column.findByIdAndUpdate(_id, { title, tasksOrder, projectId });

  return column;
}

export async function deleteColumn(columnData) {
  const { _id } = columnData;

  const column = await Column.findByIdAndDelete(_id);

  return column;
}

export async function changeColumnsOrder(columnData) {
  const { projectId, columnsOrder } = columnData;

  const project = await Project.findOneAndUpdate(projectId, { columnsOrder });

  return project;
}

export async function getAllProjectColumns(req, res) {
  try {
    const { projectId } = req.body;
    const columns = await Column.find({ projectId });

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
