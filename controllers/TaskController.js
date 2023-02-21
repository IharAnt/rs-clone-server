const taskService = require('../service/TaskService');

class TaskController {
  async createTask(req, res, next) {
    try {
      const task = req.body;
      const newTask = await taskService.createTask(task);
      return res.json(newTask);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const task = req.body;
      const newTask = await taskService.updateTask(taskId, task);
      return res.json(newTask);
    } catch (error) {
      next(error);
    }
  }

  async getExecutorTasks(req, res, next) {
    try {
      const { userId } = req.params;
      const tasks = await taskService.getExecutorTasks(userId);
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getInspectorTasks(req, res, next) {
    try {
      const { userId } = req.params;
      const tasks = await taskService.getInspectorTasks(userId);
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
