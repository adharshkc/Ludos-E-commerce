const passport = require("passport");
const { User } = require("../models/user");
const { logger } = require("../utils/logger");

module.exports = {
  findExistUser: async function (userData) {
    const email = userData.email;
    const user = await User.findOne({ email }).lean();
    if (user) return user;
  },
  loginUser: async function (userData) {
    const email = userData.email;
    const password = userData.password;
    const user = await User.findOne({ email }).lean();
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

  userDashboard : async function(userid){
    const user = await User.findOne({id: userid}).lean()
    return user;
  }
};
