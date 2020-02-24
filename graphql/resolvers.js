const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = {
  createUser: async function(args, req) {
    const { userInput } = args;

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already');
      throw error;
    }

    const hashPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashPw
    });
    const createUser = await user.save();
    return { ...createUser._doc, _id: createUser._id.toString() };
  }
};
