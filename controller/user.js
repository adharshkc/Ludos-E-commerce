const express = require("express");
const { User } = require("../models/user");
const Products = require("../models/product");
const Cart = require("../models/cart");
const { logger } = require("../utils/logger");
const userHelper = require("../helpers/user");
const passport = require("passport");

const home = async function (req, res) {
  if (req.session.user) {
    let isUser = true;
    res.render("user/index", { layout: "../layouts/layout", isUser });
  } else {
    res.render("user/index", { layout: "../layouts/layout" });
  }
};

/**********************************************GET LOGIN****************************************************************** */
const userLogin = function (req, res) {
  if (req.session.user) {
    // let isUser = true;
    res.redirect("/");
  } else if (req.session.admin) {
    res.redirect("/admin");
  }
  res.render("user/login", { layout: "../layouts/layout" });
};

/**********************************************POST LOGIN****************************************************************** */

const user_signin = async function (req, res) {
  // const { email, password } = req.body;
  // const user = await User.findOne({ email });
  // logger.info(user)
  // if (user && (await user.matchPassword(password))) {
  //   if(user.role == 'admin'){
  //     req.session.admin = true
  //     req.session.adminid = user._id
  //     res.redirect("/admin")
  //   }else if(user.role == 'user'){
  //     console.log('error')

  //     req.session.user = true;
  //     req.session.userid = user._id
  //     console.log(req.session.userid)
  //     console.log("user authenticated");
  //     res.redirect("/");
  //   }
  // } else {
  //   res.redirect("/login");
  // }
  const userData = { email: req.body.email, password: req.body.password };
  const user = await userHelper.loginUser(userData);
  if (user.role == "admin") {
    req.session.admin = true;
    req.session.adminid = user._id;
    res.redirect("/admin");
  } else if (user.role == "user") {
    req.session.user = true;
    req.session.userid = user._id;
    res.redirect("/");
  } else {
    res.render("/login", { errorMessage: "user not found" });
  }
};

/**********************************************GET REGISTER****************************************************************** */

const userRegister = function (req, res) {
  if (req.session.user) {
    let isUser = true;
    res.render("user/index", { layout: "../layouts/layout", isUser });
  }
  res.render("user/register");
};

/**********************************************POST REGISTER****************************************************************** */

const user_registration = async function (req, res) {
  const user = await userHelper.findExistUser(req.body);
  if (user) {
    logger.info("user already exists");
    res.render("user/register", { errorMessage: "user already exists" });
  } else {
    const newUser = await userHelper.registerUser(req.body);
    if (newUser) {
      req.session.user = true;
      req.session.userid = newUser._id;
      res.redirect("/");
    } else {
      res.render("user/register", { errroMessage: "error creating user" });
    }
  }
};

/**********************************************EDIT USER****************************************************************** */

const user_dashboard = async function (req, res) {
  try {
    const userId = req.session.userid;
    const user = await userHelper.userDashboard(userId);
    if (req.session.user) {
      let isUser = true;
      res.render("user/profile", { user, isUser });
    } else {
      res.render("user/profile", { user });
    }
  } catch (err) {
    logger.error({ message: err });
  }
};

const user_profile_edit = function (req, res) {
  res.render("user/edit-profile");
};

const editUser = async function (req, res) {
  const { name, phone, houseNo, city, pincode } = req.body;
  const editedUser = await User.findByIdAndUpdate({ name, phone, address });
};

const editAddress = function (req, res) {
  res.render("user/edit-address");
};

/**************************************************************GET POST CART**********************************************************/
const cart = async function (req, res) {
  if (req.session.user) {
    const userId = req.session.userid;
    let isUser = true;
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .lean();

    res.render("user/cart", {
      layout: "../layouts/layout",
      isUser,
      cart: cart,
    });
  }
};

const checkout = function (req, res) {
  res.render("user/checkout");
};

const logout = async function (req, res) {
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  userLogin,
  user_signin,
  user_registration,
  userRegister,
  user_dashboard,
  user_profile_edit,
  editAddress,
  cart,
  checkout,
  home,

  logout,
};
