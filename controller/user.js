const express = require("express");
const { User } = require("../models/user");
const Products = require("../models/product");
const Cart = require("../models/cart");




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
  }
  res.render("user/login", { layout: "../layouts/layout" });
};

/**********************************************POST LOGIN****************************************************************** */

const user_signin = async function (req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (user && (await user.matchPassword(password))) {
    req.session.user = true;
    req.session.userid = user._id
    console.log(req.session.userid)
    console.log("user authenticated");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};

/**********************************************GET REGISTER****************************************************************** */

const userRegister = function (req, res) {
  if (req.session.user) {
    let isUser = true;
    res.render("user/index", { layout: "../layouts/layout", isUser });
  }
  res.render("user/register", { layout: "../layouts/layout" });
};

/**********************************************POST REGISTER****************************************************************** */

const user_registration = async function (req, res) {
  const { name, email, password, phone } = req.body;
  console.log(
    `name ${name} email:${email}, password: ${password}, phone: ${phone}`
  );
  const user = await User.findOne({ email: email });
  if (!user) {
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      phone: phone,
    });
    if (newUser) {
      const isUser = true;
      console.log("user registered");
      res.redirect("/");
    }
  } else {
    res.status(404);
    res.redirect("/");
    console.log("user already exists");
  }
};

/**********************************************EDIT USER****************************************************************** */

const user_dashboard = async function (req, res) {
  const userId = req.session.userid
  const user = await User.findOne({userId})
  console.log(user)
  res.render("user/profile", );
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
const cart = async function(req, res){
  if (req.session.user) {
    const userId = req.session.userid
    let isUser = true;
    const cart = await Cart.findOne({user: userId}).populate('items.product').lean()
    
    res.render("user/cart", { layout: "../layouts/layout", isUser, cart: cart });
  }
  
}

const postCart = async function(req, res){
  
}



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
