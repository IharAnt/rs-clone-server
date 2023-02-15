const {Schema, model} = require('mongoose');

const AchievementSchema = new Schema({ 
  name: {type: String, required: true},
  imgBlack: {type: String},
  imgColor: {type: String},
  type: {type: String, required: true},
  description: {type: String},
  maxPoints: {type: Number},
 });

 const Achievement = model('Achievement', AchievementSchema);

 module.exports = {Achievement, AchievementSchema}