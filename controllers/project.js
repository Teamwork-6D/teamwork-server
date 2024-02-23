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

export async function updateProject(req, res) {}

export async function deleteProject(req, res) {}

export async function getAllUserProjects(req, res) {}

export async function getUserProject(req, res) {}
