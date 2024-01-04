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

const user_signin = async function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("user/login", { errorMessage: "user not found" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (user.role == "admin") {
        req.session.admin = true;
        req.session.adminid = user._id;
        res.redirect("/admin");
      } else if (user.role == "user") {
        req.session.user = true;
        req.session.userid = user._id;
        req.session.email = user.email;
        res.redirect("/");
      }
    });
  })(req, res, next);
};

/**********************************************GET REGISTER****************************************************************** */

const userRegister = function (req, res) {
  if (req.session.user) {
    let isUser = true;
    res.redirect("/");
  } else if (req.session.admin) {
    res.redirect("/admin");
  }
  res.render("user/register");
};

/**********************************************POST REGISTER****************************************************************** */

const user_registration = async function (req, res) {
  const email = req.body.email;
  const user = await userHelper.findUser(email);
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
    const userId = req.session.email;
    const user = await userHelper.findUser(userId);
    if (req.session.user) {
      let isUser = true;
      res.render("user/profile", { user, isUser });
    } else {
      res.render("user/profile", { user });
    }
  } catch (err) {
    logger.error({ message: err.message });
  }
};

const user_profile_edit = async function (req, res) {
  try {
    const userId = req.session.email;
    const user = await userHelper.findUser(userId);

    let isUser = true;
    res.render("user/edit-profile", { user, isUser });
  } catch (err) {
    logger.error({ message: err });
  }
};

const editUser = async function (req, res) {
  try {
    const userData = req.body;
    const id = req.session.userid;
    const user = await userHelper.editUser(userData, id);
    if (user) {
      res.redirect("/user/edit_profile");
    }
  } catch (error) {}
};

const add_address = async function(req, res){
  try {
    const email = req.session.email;
    const user = await userHelper.findUser(email)
    let isUser = true
    res.render("user/add-address", { user, isUser });
  } catch (error) {
    logger.error({ message: err });
  }
}

const addAddress = async function (req, res) {};

const editAddress = async function (req, res) {
  try {
    const userId = req.session.email;
    const user = await userHelper.findUser(userId);

    let isUser = true;
    res.render("user/edit-address", { user, isUser });
  } catch (err) {
    logger.error({ message: err });
  }
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
  editUser,
  addAddress,
  add_address,
  editAddress,
  cart,
  checkout,
  home,

  logout,
};
