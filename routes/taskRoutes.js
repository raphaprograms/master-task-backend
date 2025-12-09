const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const Task = require("../models/Task");

const taskRouter = express.Router({ mergeParams: true });

// Protects all rotes in this router
taskRouter.use(authMiddleware);

/**
 * GET /api/projects/:projectId/tasks
 */
taskRouter.get("/", async (req, res) => {
  try {
    const projectTasks = await Task.find({ project: req.project._id });

    res.json(projectTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/projects/:projectId/tasks/:taskId
 */
taskRouter.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id: ${taskId} not found!` });
    }

    // Authorization
    console.log(req.project._id);
    console.log(task.project);
    
    if (task.project.toString() !== req.project._id) {
      return res.status(403).json({ message: "This task doesn't belong to the current project" });
    }

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/projects/:projectId/tasks
 */
taskRouter.post("/", async (req, res) => {
  try {
    const newTask = await Task.create({
      ...req.body,
      project: req.project._id,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/projects/:projectId/tasks:/taskId
 */
taskRouter.put("/:taskId", async (req, res) => {
  try {
  // This needs an authorization check
  const taskToUpdate = await Task.findById(req.params.taskId)

    if (!taskToUpdate) {
      return res.status(404).json({ message: 'No task to update found with this id!' });
    }

    if(req.project._id !== taskToUpdate.project.toString()) {
      
      return res.status(403).json({ message: 'This is not your task!' });
    }

    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }
    res.json({ message: 'Task updated!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * DELETE /api/projects/:projectId/tasks/:taskId
 */
taskRouter.delete("/:taskId", async (req, res) => {
  try {
    // This needs an authorization check
    const taskToDelete = await Task.findById(req.params.taskId)

       if(req.project._id !== taskToDelete.project.toString()) {
      
      return res.status(403).json({ message: 'This is not your task!' });
    }

    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }

    res.json({ message: 'Task deleted!' });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = taskRouter;