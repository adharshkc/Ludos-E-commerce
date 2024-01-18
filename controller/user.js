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

/**********************************************AUTHENTICATION****************************************************************** */
const userLogin = function (req, res) {
  if (req.session.user) {
    // let isUser = true;
    res.redirect("/");
  } else if (req.session.admin) {
    res.redirect("/admin");
  }
  res.render("user/login", { layout: "../layouts/layout" });
};

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

const userRegister = function (req, res) {
  if (req.session.user) {
    let isUser = true;
    res.redirect("/");
  } else if (req.session.admin) {
    res.redirect("/admin");
  }
  res.render("user/register");
};

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
      req.session.email = newUser.email;
      res.redirect("/");
    } else {
      res.render("user/register", { errroMessage: "error creating user" });
    }
  }
};

const googleLogin =  function(){
  console.log("get")
  passport.authenticate('google', { scope: ['profile', 'email'] })
}

const callbackUrl = async function (req, res) {
  console.log(req.user)
  if(req.user){
    const user = await userHelper.findUser(req.user.email)
    if(user){
      req.session.user = true;
      req.session.userid = user._id;
       res.redirect('/');

    }
  }
};

/**********************************************USER DASHBOARD****************************************************************** */

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

const add_address = async function (req, res) {
  try {
    const email = req.session.email;
    const user = await userHelper.findUser(email);
    let isUser = true;
    res.render("user/add-address", { user, isUser });
  } catch (error) {
    logger.error({ message: err });
  }
};

const addAddress = async function (req, res) {
  try {
    const data = req.body;
    const userId = req.session.userid;
    const address = await userHelper.addAddress(data, userId);
  } catch (error) {
    logger.error({ message: err });
  }
};

const edit_address = async function (req, res) {
  try {
    const userId = req.session.userid;
    const addressId = req.params.id;
    const data = await userHelper.getAddress(userId, addressId);
    const address = data.address;
    const user = data.user;
    let isUser = true;
    res.render("user/edit-address", { user, address, isUser });
  } catch (err) {
    logger.error({ message: `couldn't get the address ${err}` });
  }
};

const editAddress = async function (req, res) {
  try {
    const userId = req.session.userid;
    const addressId = req.params.id;
    const address = req.body;
    const updatedAddress = userHelper.editAddress(userId, addressId, address);
  } catch (error) {
    logger.error({ message: `couldn't get the address ${err}` });
  }
};

const delete_address = async function (req, res) {
  const userId = req.session.userid;
  const adderssId = req.params.id;
  const deleteAddress = userHelper.deleteAddress(userId, adderssId);
  if (deleteAddress) {
    res.redirect("/user/edit_profile");
  } else {
    logger.error({ message: `couldn't get the address ${err}` });
  }
};




/**************************************************************CART SECTION**********************************************************/
const cart = async function (req, res) {
  const userId = req.session.userid;
  let isUser = true;
  const cart = await userHelper.getCart(userId);
  if (cart) {
    res.render("user/cart", {
      layout: "../layouts/layout",
      isUser,
      cart: cart.cart,
      totalPrice: cart.totalPrice,
    });
  }
};

const addToCart = async function (req, res) {
  
  const userId = req.session.userid;
  const cart = await userHelper.addItemsToCart(userId, req.params.id);
  console.log(cart);
  res.json({cart})
};

const addProductToCart = async function (req, res) {
  try {
    console.log("hitting cart");
    const userId = req.session.userid;
    const cart = await userHelper.addItemsToCart(userId, req.params.id);
    if (cart) {
      res.redirect("/cart");
    }
  } catch (err) {
    logger.error({ message: err });
  }
};

const updateCart = async function (req, res) {
  try {
    let { proId, count } = req.body;
    count = parseInt(count)
    console.log(count)
    const userId = req.session.userid;
    const updatedCart = await userHelper.updateCart(proId, count, userId);
    if (updatedCart) {
      const totalPrice = await userHelper.getCart(userId);
      console.log(totalPrice.totalPrice);
      res.json({totalPrice: totalPrice.totalPrice, updatedCart})
    }
  } catch (error) {
    logger.error({  message:"update cart failed", error });
  }
};

const deleteCart = async function(req, res){
  try {
    const newDeletedCart = await userHelper.cartDelete(req.session.userid, req.params.id)
    res.redirect('/cart')
  } catch (error) {
    
  }
}

const invoice = async function(req, res){
  const orderId = req.params.id
  console.log(orderId)
}

const logout = async function (req, res) {
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  userLogin,
  user_signin,
  user_registration,
  userRegister,
  googleLogin,
  callbackUrl,
  user_dashboard,
  user_profile_edit,
  editUser,
  addAddress,
  add_address,
  edit_address,
  editAddress,
  delete_address,
  cart,
  invoice,
  addToCart,
  addProductToCart,
  updateCart,
  deleteCart,
  home,
  logout,
};
