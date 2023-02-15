const ApiError = require("../exceptions/ApiError");
const TaskModel = require("../models/TaskModel");
const TaskDto = require("../dtos/TaskDto");

class TaskService {
  async createTask(task) {
    let user = await TaskModel.create(this.mapTaskToTaskModel(task));
    const newUser = await (TaskModel.findById(user._id)
      .populate('executor')
      .populate('inspector')
      .populate({
        path: "messages",
        populate: {
           path: "author"
        }
     }));
    const result = new TaskDto(newUser);
    return result;
  }

  mapTaskToTaskModel(task) {
    return {
      executor: task.executor.id,
      inspector: task.inspector.id,
      icon: task.icon,
      summary: task.summary,
      description: task.description,
      dueDate: task.dueDate,
      type: task.type,
      status: task.status,
      taskReport: task.taskReport,
      messages: task.messages?.map((m) => ({message: m.message, author: m.author.id})),
      imgFiles: task.imgFiles?.map((img) => ({name: img.name, data: img.data})),
      points: task.points,
    }
  }
}

module.exports = new TaskService();
