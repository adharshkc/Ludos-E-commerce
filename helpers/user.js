const passport = require("passport");
const { User, Address } = require("../models/user");
const { logger } = require("../utils/logger");

module.exports = {
  /**************************************************************AUTH SECTION**********************************************************/

  findUser: async function (userData) {
    const user = await User.findOne({ email: userData })
      .populate("address")
      .lean();
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
  // findUserAndAdress: async function(userData){
  //   const userAddress = await User.findOne({email})
  // },
  editUser: async function (userData, id) {
    const { name, phone } = userData;
    const user = await User.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true }
    );
    if (user) return user;
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
    console.log(address);
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
    console.log(user);
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
    if (cart) {
      let totalPrice = 0;
      for (const cartItem of cart.cart) {
        if (cartItem.product_id && cartItem.product_id.price) {
          totalPrice += cartItem.quantity * cartItem.product_id.price;
        }
      }

      return { cart, totalPrice };
    }
  },

  addItemsToCart: async function (userId, proId) {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      console.log("user not found");
    }
    // if(user){
    //   const result = await User.updateOne(
    //     { _id: userId, 'cart.product_id': proId},
    //     {
    //       $inc: {'cart.$.quantity': 1},
    //       $addToSet:
    //         {cart: {product_id: proId, quantity: 1}}

    //     }
    //   )
    //   return result
    // }

    const existingItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product_id.toString() == proId
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += 1;
    } else {
      user.cart.push({ product_id: proId, quantity: 1 });
    }
    const newCart = await User.updateOne({ _id: userId }, { cart: user.cart });
    return newCart;
  },

  updateCart: async function (proId, count, userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        logger.error({ message: "cart not found" });
      }

      const cartItem = await user.cart.find(item => item.product_id == proId);
      console.log("quantity "+cartItem.quantity)
      const currentQuantity = cartItem ? cartItem.quantity : 0;
      console.log("current quantity"+ currentQuantity)
      console.log("current quantity + count"+currentQuantity + count)
      const updatedCount = Math.max(currentQuantity + count, 1);
      console.log("updated count"+updatedCount);
      const updatedCart = await User.updateOne(
        { _id: userId, "cart.product_id": proId },
        { $set: { "cart.$.quantity": updatedCount } }
        );
        
        if (updatedCount == 0) {
          
          const newCart =  await User.updateOne(
            { _id: userId },
            { $pull: { cart: { product_id: proId } } },
            {new: true}
            );
      } else {
        logger.error("error deleting cart")
      }

      const updatedUserCart = await User.findOne({ _id: userId });
      return updatedUserCart;
    } catch (error) {
      logger.error("cart updation failed");
    }
  },
  cartDelete: async function(userId, proId){
    try {
      console.log(userId)
      console.log("deleted ")
      const cart = await User.findOne({_id: userId})
      console.log(cart)
      if(cart){
        const deletedCart = await User.updateOne(
          {_id: userId},
          {$pull: {cart: {product_id: proId}}},
          {new: true}
        )
        return deletedCart;
      }else{
        console.log("cart not found")
      }

    } catch (error) {
      
    }
  }
};
