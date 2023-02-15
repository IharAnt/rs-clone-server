const taskService = require("../service/TaskService");

class TaskController {
  async createTask(req, res, next) {
    try {
      const task = req.body
      const newTask = await taskService.createTask(task);
      return res.json(newTask);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();