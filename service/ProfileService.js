const ApiError = require('../exceptions/ApiError');
const { Profile } = require('../models/ProfileModel');
const ProfileDto = require('../dtos/ProfileDto');
const { Task } = require('../models/TaskModel');
const { Level } = require('../models/LevelModel');
const taskStatuses = require('../models/consts/TaskStatuses');
const UserModel = require('../models/UserModel');

class ProfileService {
  async getProfile(userId) {
    const profile = await Profile.findOne({ user: userId }).populate('user').populate('achievements');
    if (!profile) {
      throw ApiError.BadRequest('Profile not foun');
    }

    const executorTasks = await Task.find({ executor: userId });
    const tasksStatus = {
      open: executorTasks.filter((task) => task.status === taskStatuses.Open)?.length ?? 0,
      inprogress: executorTasks.filter((task) => task.status === taskStatuses.Inprogress)?.length ?? 0,
      resolved: executorTasks.filter((task) => task.status === taskStatuses.Resolved)?.length ?? 0,
      approved: executorTasks.filter((task) => task.status === taskStatuses.Approved)?.length ?? 0,
    };
    if (profile.doneTasks === 0) {
      profile.doneTasks = tasksStatus.approved;
      await profile.save();
    }
    const nextLevelExperience = await this.getNextLevelExp(profile.level);
    return new ProfileDto(profile, { nextLevelExperience, tasksStatus });
  }

  async updateProfile(userId, updateProfile) {
    await Profile.findOneAndUpdate({ user: userId }, updateProfile);
    await UserModel.findOneAndUpdate({ _id: userId }, updateProfile);

    return this.getProfile(userId);
  }

  async getNextLevelExp(level) {
    let lvl = await Level.findOne({ level: { $gt: level } });
    if (!lvl) {
      lvl = await Level.findOne({ level: { $gte: level } });
    }
    return lvl.experience;
  }

  async addLevel(level, experience) {
    const lvl = await Level.create({ level, experience });
    return lvl;
  }
}

module.exports = new ProfileService();
