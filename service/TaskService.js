const ApiError = require("../exceptions/ApiError");
const {Task} = require("../models/TaskModel");
const TaskDto = require("../dtos/TaskDto");
const taskStatuses = require("../models/consts/TaskStatuses");
const { Profile } = require("../models/ProfileModel");

class TaskService {
  async createTask(task) {
    let newTask = await Task.create(this.mapTaskToTaskModel(task));
    newTask = await Task.findById(newTask._id)
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
    // await this.calculateProfile(taskId, task);
    let updatedTask = await Task.findOneAndUpdate({ _id: taskId }, 
      this.mapTaskToTaskModel(task), { new: true })
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
    const tasks = await Task.find({ executor: userId })
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
    const tasks = await Task.find({ inspector: userId })
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

  async calculateProfile(taskId, task) {
    if(task.status === taskStatuses.Approved) {
      return;
    }
    const oldTask = await Task.findById(taskId);
    if(!oldTask || oldTask.status === taskStatuses.Approved) {
      return;
    }
    const a = 0;
    const profile = await Profile.findOne({ user: task.executor.id })
      .populate("achievements");

    let experience = profile.experiences.findLast((exp) => exp.type === "inprogress");
    // let experience = await profile.experiences.find({ $elemMatch : { type : task.type } });
    if(experience) {
      experience.value += task.points;
    } else {
      experience = {
        type: task.type,
        value: task.points,
      };
      profile.experiences.push(experience);
    }

    let achievement = profile.achievements.find((achievement) => achievement.type === experience.type);

    profile.totalExperience += task.points;
    profile.moticoins += task.points;
    profile.doneTasks += 1;

    await profile.save();

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
