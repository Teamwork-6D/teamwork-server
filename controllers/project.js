import Project from "../models/project.js";

export async function createProject(req, res) {
  try {
    const { title } = req.body;

    const newProject = await Project.create({
      title,
      owner: req.user._id,
    });

    res.status(201).json({
      status: "success",
      project: newProject,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Unable to create project",
    });
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const project = await Project.findByIdAndUpdate(id, {
      title,
    });

    res.status(201).json({
      status: "success",
      project,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Unable to update project data",
    });
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
      project,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Unable to delete project data",
    });
  }
}

export async function getAllUserProjects(req, res) {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: { $in: [req.user._id] } }],
    });
    res.status(201).json({
      status: "success",
      length: projects.length,
      projects,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "No projects found",
    });
  }
}

export async function getUserProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    res.status(200).json({
      status: "success",
      project,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "No project found",
    });
  }
}
