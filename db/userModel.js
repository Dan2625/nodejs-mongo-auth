const ROLES = require('../helpers/role');

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Provide a user name'],
    uniqe: true,
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    required: true,
    enum: [ROLES.STUDENT, ROLES.MENTOR],
  },
});
UserSchema.index({ username: 1, role: 1 }, { unique: true });
const UserModel = mongoose.model('Users', UserSchema);

// UserModel.createIndexes();
// module.exports = mongoose.model.Users || UserModel;
module.exports = UserModel;
