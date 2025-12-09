const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const Project = require("../models/Project");

const projectRouter = express.Router();

// Protects all rotes in this router
projectRouter.use(authMiddleware);

const taskRoutes = require('./taskRoutes');

projectRouter.use('/:projectId/tasks', taskRoutes);

/**
 * GET /api/projects
 */
projectRouter.get("/", async (req, res) => {
  try {
    const userProjects = await Project.find({ user: req.user._id });

    res.json(userProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/projects/:projectId
 */
projectRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found!` });
    }

    // Authorization
    console.log(req.user._id);
    console.log(project.user);
    
    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" });
    }

    res.json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/projects
 */
projectRouter.post("/", async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/projects/projectId
 */
projectRouter.put("/:projectId", async (req, res) => {
  try {
  // This needs an authorization check
  const projectToUpdate = await Project.findById(req.params.projectId)

    if (!projectToUpdate) {
      return res.status(404).json({ message: 'No project to update found with this id!' });
    }

    if(req.user._id !== projectToUpdate.user.toString()) {
      
      return res.status(403).json({ message: 'This is not your project!' });
    }

    const project = await Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'No project found with this id!' });
    }
    res.json({ message: 'Project updated!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * DELETE /api/projects/projectId
 */
projectRouter.delete("/:projectId", async (req, res) => {
  try {
    // This needs an authorization check
    const projectToDelete = await Project.findById(req.params.projectId)

       if(req.user._id !== projectToDelete.user.toString()) {
      
      return res.status(403).json({ message: 'This is not your project!' });
    }

    const project = await Project.findByIdAndDelete(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'No project found with this id!' });
    }

    res.json({ message: 'Project deleted!' });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = projectRouter;