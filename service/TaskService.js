const { Task } = require('../models/TaskModel');
const TaskDto = require('../dtos/TaskDto');
const taskStatuses = require('../models/consts/TaskStatuses');
const { Profile } = require('../models/ProfileModel');
const { Achievement } = require('../models/AchievementModel');
const { Level } = require('../models/LevelModel');

class TaskService {
  async createTask(task) {
    let newTask = await Task.create(this.mapTaskToTaskModel(task));
    newTask = await Task.findById(newTask._id)
      .populate('executor')
      .populate('inspector')
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
        },
      });
    const result = new TaskDto(newTask);
    return result;
  }

  async updateTask(taskId, task) {
    await this.calculateProfile(taskId, task);
    let updatedTask = await Task.findOneAndUpdate({ _id: taskId }, this.mapTaskToTaskModel(task), { new: true })
      .populate('executor')
      .populate('inspector')
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
        },
      });
    const result = new TaskDto(updatedTask);
    return result;
  }

  async getExecutorTasks(userId) {
    const tasks = await Task.find({ executor: userId })
      .populate('executor')
      .populate('inspector')
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
        },
      });
    const result = tasks
      .filter((task) => task.executor !== null && task.inspector !== null)
      .map((task) => new TaskDto(task));
    return result;
  }

  async getInspectorTasks(userId) {
    const tasks = await Task.find({ inspector: userId })
      .populate('executor')
      .populate('inspector')
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
        },
      });
    const result = tasks
      .filter((task) => task.executor !== null && task.inspector !== null)
      .map((task) => new TaskDto(task));
    return result;
  }

  async calculateProfile(taskId, task) {
    if (task.status !== taskStatuses.Approved) {
      return;
    }
    const oldTask = await Task.findById(taskId);
    if (!oldTask || oldTask.status === taskStatuses.Approved) {
      return;
    }
    const profile = await Profile.findOne({ user: task.executor.id }).populate('achievements');

    // let experience = await Profile.findOne({ user: task.executor.id, "experiences.type": task.type }, {"experiences.$": true });
    // let sdfsdf = experience.experiences[0].value;
    // let experience2 = await Profile.findOne({ user: task.executor.id, "experiences.type": task.type }, {experiences: 1 }).exec();
    // console.log(experience);
    // let experience = await profile.experiences.find({ $elemMatch : { type : task.type } });
    let experience = [...profile.experiences].find((exp) => exp.type === task.type);
    if (experience) {
      experience.value += task.points;
    } else {
      experience = {
        type: task.type,
        value: task.points,
      };
      profile.experiences.push(experience);
    }

    profile.totalExperience += task.points;
    profile.moticoins += task.points;
    profile.doneTasks += 1;

    const lvl = await Level.findOne({ experience: { $gte: profile.totalExperience } });
    if (profile.totalExperience >= lvl.experience) {
      profile.level = lvl.level;
    } else {
      profile.level = lvl.level - 1;
    }

    const achievement = [...profile.achievements].find((ach) => ach.type === experience.type);
    if (!achievement) {
      const etalonAchievement = await Achievement.findOne({ type: task.type });
      if (etalonAchievement && etalonAchievement.maxPoints <= experience.value) {
        profile.achievements.push(etalonAchievement);
      }
    }
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
