const User = require('../db/userModel');
const ROLES = require('../helpers/role');

exports.findAllStudents = () => {
  return User.find({ role: ROLES.STUDENT }, '-password');
};
