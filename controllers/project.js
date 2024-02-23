import Project from "../models/project.js";

export async function createProject(req, res, next) {
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
    console.log(error);
    res.status(400).json({
      status: "error",
      message: "unable to create project",
    });
  }
}
