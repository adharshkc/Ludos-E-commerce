const passport = require("passport");
const { User } = require("../models/user");
const { logger } = require("../utils/logger");

module.exports = {
  findUser: async function (userData) {
    const user = await User.findOne({ email: userData }).lean();
    if (user) return user;
  },
  loginUser: async function (userData) {
    const email = userData.email;
    const password = userData.password;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return user;
    }
  },

  registerUser: async function (userData) {
    const { name, email, password, phone } = userData;
    const user = await User.findOne({ email: email }).lean();
    if (!user) {
      const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        phone: phone,
      });
      return newUser;
    }
  },
  editUser: async function (userData, id) {
    const { name, phone } = userData;
    console.log(userData);
    const user = await User.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true }
    );
    if (user) return user;
  },
};
