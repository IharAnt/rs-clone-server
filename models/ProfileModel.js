const { Schema, model } = require('mongoose');

const ProfileSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  birthday: { type: String },
  phone: { type: String },
  photo: { type: String },
  moticoins: { type: Number, default: 0 },
  totalExperience: { type: Number, default: 0 },
  experiences: [
    {
      type: { type: String },
      value: { type: Number },
    },
  ],
  achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
  level: { type: Number, default: 0 },
  doneTasks: { type: Number, default: 0 },
});

const Profile = model('Profile', ProfileSchema);

module.exports = { Profile, ProfileSchema };
