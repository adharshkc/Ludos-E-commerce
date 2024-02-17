const passport = require("passport");
const { User, Address } = require("../models/user");
const { logger } = require("../utils/logger");
const Token = require("../models/token");

module.exports = {
  /**************************************************************AUTH SECTION**********************************************************/

  findUser: async function (userData) {
    const user = await User.findOne({ email: userData })
      .populate("address")
      .lean();
    if (user) return user;
  },
  findUserById: async function (id) {
    const user = await User.findOne({ _id: id });
    return user;
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
        isVerified: false,
      });
      return newUser;
    }
  },

  addToken: async function (token) {
    const tokenAdd = await Token.create({ token });
    return tokenAdd;
  },

  findToken: async function (token) {
    const dbToken = await Token.findOne({ token: token });
    return dbToken;
  },

  editUser: async function (userData, id) {
    const { name, phone } = userData;
    const user = await User.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true }
    );
    if (user) return user;
  },

  updateUserStatus: async function (email) {
    const result = await User.findOneAndUpdate(
      { email: email },
      { $set: { isVerified: true } },
      { new: true }
    );
    return result;
  },

  passReset: async function (password, id) {
    const result = await User.findOneAndUpdate(
      { _id: id },
      { $set: { password: password } },
      { new: true }
    );
    return result;
  },

  /**************************************************************ADDRESS SECTION**********************************************************/

  addAddress: async function (data, userid) {
    const { houseName, street, city, pincode } = data;
    const addedAddress = await Address.create({
      user: userid,
      houseName: houseName,
      street: street,
      city: city,
      pincode: pincode,
    });
    if (addedAddress) {
      const addedAddressToUser = await User.findByIdAndUpdate(
        userid,
        { $push: { address: addedAddress } },
        { new: true }
      );
      return addedAddressToUser;
    } else {
      logger.error("error adding address");
    }
  },
  getUserAddress: async function (userid) {
    const user = await User.findById(userid);
    return user.address;
  },
  getAddress: async function (userId, addressId) {
    const userAddress = await User.findOne(
      { _id: userId, "address._id": addressId },
      { "address.$": 1 }
    ).lean();
    const address = userAddress.address[0];
    const user = await User.findOne({ _id: userId }).lean();
    return { user, address };
  },

  editAddress: async function (userId, addressId, address) {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        $set: {
          houseName: address.houseName,
          street: address.street,
          city: address.city,
          pincode: address.pincode,
        },
      },
      { new: true }
    );

    const user = await User.findOneAndUpdate(
      { _id: userId, "address._id": addressId },
      { $set: { "address.$": updatedAddress } },
      { new: true }
    );
  },

  deleteAddress: async function (userId, addressId) {
    const deleteAddress = await Address.findByIdAndDelete(addressId);
    const delUserAddress = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { address: { _id: addressId } } },
      { new: true }
    );
    return delUserAddress;
  },

  /**************************************************************CART SECTION**********************************************************/

  getCart: async function (userId) {
    const cart = await User.findOne({ _id: userId })
      .populate("cart.product_id")
      .lean();
    if (cart.cart) {
      let totalPrice = 0;
      for (const cartItem of cart.cart) {
        if (cartItem.product_id && cartItem.product_id.price) {
          totalPrice += cartItem.quantity * cartItem.product_id.price;
        }
      }

      return { cart, totalPrice };
    } else {
      return { cart };
    }
  },

  addItemsToCart: async function (userId, proId) {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      logger.log({ message: "user not found" });
    }
    const existingItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product_id.toString() == proId
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += 1;
    } else {
      user.cart.push({ product_id: proId, quantity: 1 });
    }
    const newCart = await User.updateOne({ _id: userId }, { cart: user.cart });
    console.log(newCart);
    return newCart;
  },

  addCartGuest: async function(userId, proId, quantity){
    const user = await User.findOne({_id: userId})
    const existingItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product_id.toString() == proId
    )
    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product_id: proId, quantity: quantity });
    }
    const newCart = await User.updateOne({ _id: userId }, { cart: user.cart });
    console.log(newCart)
  },

  updateCart: async function (proId, count, userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        logger.error({ message: "cart not found" });
      }

      const cartItem = await user.cart.find((item) => item.product_id == proId);
      const currentQuantity = cartItem ? cartItem.quantity : 0;
      const updatedCount = Math.max(currentQuantity + count, 1);
      const updatedCart = await User.updateOne(
        { _id: userId, "cart.product_id": proId },
        { $set: { "cart.$.quantity": updatedCount } }
      );

      if (updatedCount == 0) {
        const newCart = await User.updateOne(
          { _id: userId },
          { $pull: { cart: { product_id: proId } } },
          { new: true }
        );
      } else {
        logger.error("error deleting cart");
      }

      const updatedUserCart = await User.findOne({ _id: userId });
      return updatedUserCart;
    } catch (error) {
      logger.error("cart updation failed");
    }
  },
  cartDelete: async function (userId, proId) {
    try {
      const cart = await User.findOne({ _id: userId });
      if (cart) {
        const deletedCart = await User.updateOne(
          { _id: userId },
          { $pull: { cart: { product_id: proId } } },
          { new: true }
        );
        return deletedCart;
      } else {
        logger.log({ message: "cart not found" });
      }
    } catch (error) {}
  },
  deleteCartAfterOrder: async function (userId) {
    try {
      const cart = await User.findOneAndUpdate(
        { _id: userId },
        { $unset: { cart: 1 } },
        { new: true }
      );
      return cart;
    } catch (error) {
      logger.error({ message: "error deleting cart" });
    }
  },

  getWishlist: async function (userId) {
    const wishlist = await User.findOne({ _id: userId })
      .populate("wishlist.product_id")
      .lean();

    return wishlist.wishlist;
  },

  wishlistAdd: async function (userId, proId) {
    const user = await User.findOne({ _id: userId });
    user.wishlist.push({ product_id: proId });
    const wishlist = await User.findByIdAndUpdate(
      { _id: userId },
      { wishlist: user.wishlist }
    );
    return wishlist;
  },

  wishlistDelete: async function (userId, proId) {
    const delWishlist = await User.updateOne(
      { _id: userId },
      { $pull: { wishlist: { product_id: proId } } },
      { new: true }
    );
    const user = await User.findOne({ _id: userId });
    return delWishlist;
  },

  updateCoupon: async function (userid, code, discount) {
    try {
      const coupon = await User.updateOne(
        { _id: userid },
        { "coupon.code": code, "coupon.discount": discount },
        { new: true }
      );
    } catch (error) {
      console.log(error)
    }
  },

  couponRemove: async function (userid, code, discount) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userid },
        { $unset: { coupon: 1 } },
        { new: true }
      );
      return updatedUser;
      
    } catch (error) {
      console.log(error)
    }
  },
};
