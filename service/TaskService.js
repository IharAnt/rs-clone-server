const ApiError = require("../exceptions/ApiError");
const TaskModel = require("../models/TaskModel");
const TaskDto = require("../dtos/TaskDto");

class TaskService {
  async createTask(task) {
    let newTask = await TaskModel.create(this.mapTaskToTaskModel(task));
    newTask = await TaskModel.findById(newTask._id)
      .populate("executor")
      .populate("inspector")
      .populate({
        path: "messages",
        populate: {
          path: "author",
        },
      });
    const result = new TaskDto(newTask);
    return result;
  }

  async updateTask(taskId, task) {
    let updatedTask = await TaskModel.findOneAndUpdate({ _id: taskId }, this.mapTaskToTaskModel(task), {
      new: true,
    })
      .populate("executor")
      .populate("inspector")
      .populate({
        path: "messages",
        populate: {
          path: "author",
        },
      });
    const result = new TaskDto(updatedTask);
    return result;
  }

  async getExecutorTasks(userId) {
    const tasks = await TaskModel.find({ executor: userId })
      .populate("executor")
      .populate("inspector")
      .populate({
        path: "messages",
        populate: {
          path: "author",
        },
      });
    const result = tasks.map((task) => new TaskDto(task));
    return result;
  }

  async getInspectorTasks(userId) {
    const tasks = await TaskModel.find({ inspector: userId })
      .populate("executor")
      .populate("inspector")
      .populate({
        path: "messages",
        populate: {
          path: "author",
        },
      });
    const result = tasks.map((task) => new TaskDto(task));
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
      messages: task.messages?.map((m) => ({
        message: m.message,
        author: m.author.id,
      })),
      imgFiles: task.imgFiles?.map((img) => ({
        name: img.name,
        data: img.data,
      })),
      points: task.points,
    };
  }
}

module.exports = new TaskService();
