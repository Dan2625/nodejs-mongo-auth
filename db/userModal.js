const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Provide a user name'],
    uniqe: [true, 'Username exist'],
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    uniqe: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model('Users', UserSchema);
