const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const RevitElement = require('../models/RevitElement');

module.exports = {
  createUser: async function(args, req) {
    const { userInput } = args;
    const { name } = userInput;
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'Email is invalid.' });
    }

    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 8 })
    ) {
      errors.push({ message: 'password too short' });
    }

    if (errors.length > 0) {
      const error = new Error('Invalid input');
      error.data = errors;
      error.code = 422;

      throw error;
    }

    const createUser = await User.create({
      name,
      email: userInput.email,
      password: userInput.password
    });
    return { ...createUser._doc, _id: createUser._id.toString() };
  },

  login: async function({ email, password }) {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('User not found');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect');
      error.code = 401;
      throw error;
    }

    const token = user.getSignedJwtToken();

    return { token, userId: user._id };
  },

  revitElements: async function() {
    return RevitElement.find({});
  }
};
