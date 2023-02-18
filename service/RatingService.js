const AchievementDto = require("../dtos/AchievementDto");
const RatingDto = require("../dtos/RatingDto");
const ApiError = require("../exceptions/ApiError");
const { Achievement } = require("../models/AchievementModel");
const orderType = require("../models/consts/OrderType");
const ratingSortType = require("../models/consts/RatingSortType");
const { Profile } = require("../models/ProfileModel");
const UserModel = require("../models/UserModel");
const profileService = require("./ProfileService");

class RatingService {
  async addAchievement(achievement) {
    const newAchievement = await Achievement.create(achievement);
    const result = new AchievementDto(newAchievement);
    return result;
  }

  async getAchievements() {
    const achievements = await Achievement.find();
    const result = achievements.map(
      (newAchievement) => new AchievementDto(newAchievement)
    );
    return result;
  }

  async addAchivementToProfile(userId, achievementId) {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw ApiError.BadRequest("Profile not foun");
    }
    // profile.achievements = []
    profile.achievements.push(achievementId);
    await profile.save();
    return profileService.getProfile(userId);
  }

  async getRating(page, limit, sort, order) {
    limit = Math.abs(limit) || 10;
    page = (Math.abs(page) || 1) - 1;
    const count = (await Profile.find()).length;

    let sortObj = this.getSortObject(sort, order);

    let agregate = Profile.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: Achievement.collection.name,
          localField: "achievements",
          foreignField: "_id",
          as: "achievements",
        },
      },
      {
        $project: {
          user: 1,
          birthday: 1,
          phone: 1,
          // photo: 1,
          moticoins: 1,
          totalExperience: 1,
          experiences: 1,
          achievements: 1,
          level: 1,
          doneTasks: 1,
          numberOfAchievements: {
            $cond: {
              if: { $isArray: "$achievements" },
              then: { $size: "$achievements" },
              else: 0,
            },
          },
        },
      },
      { $unwind: "$user" },
      sortObj,
      // { $sort: { "user.name": -1 }},
      // { $sort: { "numberOfAchievements": 1 } },
      // { $sort: { "totalExperience": -1 } },
      { $skip: limit * page },
      { $limit: limit },
    ]);

    agregate = await agregate.exec();
    console.log("+++++++++++++++++++++++++++++");
    console.log(agregate);
    const result = {
      count,
      page: page + 1,
      limit,
      items: (await agregate).map((profile) => new RatingDto(profile)),
    }
    return result;
  }

  getSortObject(sort, order) {
    let sortObj = {
      $sort: {
        [`${ratingSortType.TotalExperience}`]: order === orderType.Asc ? 1 : -1,
      },
    };
    if (
      sort &&
      order &&
      sort !== ratingSortType.Empty &&
      order !== orderType.Empty
    ) {
      if (sort === ratingSortType.Place) {
        return {
          $sort: {
            [`${ratingSortType.TotalExperience}`]:
              order === orderType.Asc ? -1 : 1,
          },
        };
      }

      if (sort === ratingSortType.ApprovedTasks) {
        return {
          $sort: {
            [`doneTasks`]:
              order === orderType.Asc ? 1 : -1,
          },
        };
      }

      return {
        $sort: {
          [`${sort}`]:
            order === orderType.Asc ? 1 : -1,
        },
      };
    }
    return sortObj;
  }
}

module.exports = new RatingService();
