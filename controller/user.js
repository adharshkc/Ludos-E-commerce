const Products = require("../models/product");
const { logger } = require("../utils/logger");
const userHelper = require("../helpers/user");
const passport = require("passport");
const productHelper = require("../helpers/product");
const bcrypt = require("bcrypt");
const transporter = require("../middlewares/mailer");
const { generateToken, verifyToken } = require("../middlewares/token");

const home = async function (req, res) {
  const products = await productHelper.getAllProduct();
  if (req.session.user) {
    let isUser = true;
    res.render("user/index", { layout: "../layouts/layout", isUser, products });
  } else {
    console.log("home",req.session.cart)
    res.render("user/index", { layout: "../layouts/layout", products });
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
  console.log("login",req.session.cart)
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
        if(req.session.cart){
          console.log(req.session.cart)
        }
        console.log(req.session.cart)
        req.session.user = true;
        req.session.userid = user._id;
        req.session.email = user.email;
        req.session.isVerified = user.isVerified;
        res.redirect("/");
      }
    });
  })(req, res, next);
};

const userRegister = function (req, res) {
  if (req.session.user) {
    res.redirect("/");
  } else if (req.session.admin) {
    res.redirect("/admin");
  }
  res.render("user/register");
};

const user_registration = async function (req, res) {
  const email = req.body.email;
  const user = await userHelper.findUser(email);
  if (user && user.isVerified == true) {
    logger.info("user already exists");
    res.render("user/register", {
      errorMessage: "user already exists, kindly login",
    });
  } else {
    const token = generateToken(email);
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    const mailOption = {
      from: "adharshkc2017@gmail.com",
      to: email,
      subject: "Ludos Shopping Verification Email",
      html: `<h3>Click <a href="${verificationUrl}">Verify Email</a> to verify your email.</h3>`,
    };
    transporter.sendMail(mailOption, async (error, info) => {
      if (error) logger.error({ message: `error sending mail ${error}` });
      const newUser = await userHelper.registerUser(req.body);
      logger.info("email sent");
      res.redirect("/verify");
    });
  }
};

const verify = function (req, res) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/verify");
  }
};

const verifyEmail = async function (req, res) {
  const token = req.query.token;
  const decoded = verifyToken(token);
  const dbToken = await userHelper.findToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }
  if (dbToken) {
    res.render("user/error");
  }
  const email = decoded.email;
  const verifyUser = await userHelper.updateUserStatus(email);
  if (verifyUser) {
    const addedToken = await userHelper.addToken(token);
    req.session.user = true;
    req.session.userid = verifyUser._id;
    req.session.email = verifyUser.email;
    req.session.isVerified = verifyUser.isVerified;
    res.redirect("/");
  } else {
    logger.error({ message: "invalid token" });
  }
};

const googleLogin = function () {
  passport.authenticate("google", { scope: ["profile", "email"] });
};

const callbackUrl = async function (req, res) {
  if (req.user) {
    const user = await userHelper.findUser(req.user.email);
    if (user) {
      req.session.user = true;
      req.session.userid = user._id;
      res.redirect("/");
    }
  }
};

const fbCallback = async function (req, res) {
  if (req.user) {
    const user = await userHelper.findUser(req.user.email);
    if (user) {
      req.session.user = true;
      req.session.userid = user._id;
      res.redirect("/");
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

const getAddress = async function (req, res) {
  try {
    const userid = req.session.userid;
    const addressess = await userHelper.getUserAddress(userid);
    res.json({ addressess });
  } catch (error) {
    logger.error({ message: error });
  }
};

const resetPassword = async function (req, res) {
  let isUser = true;
  res.render("user/reset-password", { isUser });
};

const passwordReset = async function (req, res) {
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  const resetPass = await userHelper.passReset(password, req.session.userid);
};

const add_address = async function (req, res) {
  try {

    const email = req.session.email;
    const user = await userHelper.findUser(email);
    let isUser = true;
    res.render("user/add-address", { user, isUser });
  } catch (error) {
    logger.error({ message: error });
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
  if (userId) {
    let isUser = true;
    const cart = await userHelper.getCart(userId);
    const newCart = cart.cart;
    const cartLength = newCart.cart.length;
    if (cart) {
      res.render("user/cart", {
        layout: "../layouts/layout",
        isUser,
        length: cartLength,
        cart: newCart,
        totalPrice: cart.totalPrice,
      });
    }
  } else {
    const cart = req.session.cart;
    if (cart) {
      console.log(cart);

      let cartItems = [];
      let totalPrice = 0;
      for (const item of cart) {
        console.log(item.productId);
        let items = await productHelper.getProduct(item.productId);
        let quantity = item.quantity
        cartItems.push({productId:items, quantity: quantity});
        console.log(cartItems)
        totalPrice += item.quantity * items.price;
      }
      const quantity = cart.quantity
      const cartLength = cartItems.length;
      res.render("user/cart", {
        layout: "../layouts/layout",
        length: cartLength,
        cart: cartItems,
        
        totalPrice: totalPrice,
      });
    } else {
      res.render("user/cart");
    }
  }
};

const addToCart = async function (req, res) {
  const userId = req.session.userid;
  if (userId) {
    const cart = await userHelper.addItemsToCart(userId, req.params.id);
    res.json({ cart });
  } else {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    const existingItemIndex = req.session.cart.findIndex((cartItem) => {
      return cartItem.productId == req.params.id;
    });
    if (existingItemIndex !== -1) {
      req.session.cart[existingItemIndex].quantity += 1;
    } else {
      const cart = {
        productId: req.params.id,
        quantity: 1,
      };
      req.session.cart.push(cart);
    }
    const carts = req.session.cart;
    console.log(carts);
    res.json({ carts });
  }
};

const addProductToCart = async function (req, res) {
  try {
    const userId = req.session.userid;
    if (userId) {
      const cart = await userHelper.addItemsToCart(userId, req.params.id);
      if (cart) {
        res.redirect("/cart");
      }
    } else {
      if (!req.session.cart) {
        req.session.cart = [];
      }
      const existingItemIndex = req.session.cart.findIndex((cartItem) => {
        return cartItem.productId == req.params.id;
      });
      if (existingItemIndex !== -1) {
        req.session.cart[existingItemIndex].quantity += 1;
      } else {
        const cart = {
          productId: req.params.id,
          quantity: 1,
        };
        req.session.cart.push(cart);
      }
      const carts = req.session.cart;

      res.redirect("/cart");
    }
  } catch (err) {
    logger.error({ message: err });
  }
};

const updateCart = async function (req, res) {
  try {
    let { proId, count } = req.body;
    count = parseInt(count);
    const userId = req.session.userid;
    if (userId) {
      const updatedCart = await userHelper.updateCart(proId, count, userId);
      if (updatedCart) {
        const totalPrice = await userHelper.getCart(userId);
        res.json({ totalPrice: totalPrice.totalPrice, updatedCart });
      }
    }else{
      // const cart = req.session.cart;
      // console.log("this,,, ",cart)
      // const cartItem = cart.find((item)=>item.productId == proId)
      // console.log(cartItem)
      // const currentQuantity = cartItem? cartItem.quantity:0;
      // req.session.count = Math.max(currentQuantity+count, 1)
      // console.log("count ",req.session.count)
      // console.log("itemq ",cartItem.quantity)
      // cartItem.quantity = req.session.count
      // console.log(cart)
      // req.session.cart.push(cart)
      // console.log("sessuib", req.session.cart)
    }
  } catch (error) {
    console.log(error)
    logger.error({ message: "update cart failed", error });
  }
};

const deleteCart = async function (req, res) {
  try {
    const userId = req.session.userid;
    if (userId) {
      console.log(userId);
      const newDeletedCart = await userHelper.cartDelete(
        req.session.userid,
        req.params.id
      );
      res.redirect("/cart");
    } else {
      let cart = req.session.cart;
      console.log(cart);
      if (cart) {
        const existingProductIndex = cart.findIndex((cartItem) => {
          return cartItem.productId == req.params.id;
        });
        console.log(existingProductIndex);
        const newCart = cart.splice(existingProductIndex, 1);
        console.log("this is ", cart);
        req.session.cart = cart;
        res.redirect("/cart");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const invoice = async function (req, res) {
  const orderId = req.params.id;
};

const wishlist = async function (req, res) {
  const userId = req.session.userid;
  const wishlistItems = await userHelper.getWishlist(userId);
  let isUser = true;
  res.render("user/wishlist", { items: wishlistItems, isUser: isUser });
};

const addWishlist = async function (req, res) {
  const proId = req.params.id;
  const userId = req.session.userid;
  const addedWishlist = await userHelper.wishlistAdd(userId, proId);
  res.json({ addedWishlist });
};

const deleteWishlist = async function (req, res) {
  const proId = req.params.id;
  const userId = req.session.userid;
  const deletedWishlist = await userHelper.wishlistDelete(userId, proId);
  res.redirect("/user/wishlist");
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
  verifyEmail,
  verify,
  googleLogin,
  callbackUrl,
  fbCallback,
  user_dashboard,
  user_profile_edit,
  editUser,
  passwordReset,
  resetPassword,
  addAddress,
  add_address,
  edit_address,
  getAddress,
  editAddress,
  delete_address,
  cart,
  invoice,
  addToCart,
  addProductToCart,
  updateCart,
  deleteCart,
  wishlist,
  addWishlist,
  deleteWishlist,
  home,
  logout,
};
