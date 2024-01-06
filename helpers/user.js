const passport = require("passport");
const { User, Address } = require("../models/user");
const { logger } = require("../utils/logger");

module.exports = {
  findUser: async function (userData) {
    const user = await User.findOne({ email: userData }).populate('address').lean();
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

  addAddress: async function(data, userid){
    const {houseName, street, city, pincode} = data;
    const addedAddress = await Address.create({
      user: userid,
      houseName: houseName,
      street: street,
      city: city,
      pincode: pincode
    })
    if(addedAddress) {
      const addedAddressToUser = await User.findByIdAndUpdate(
         userid,
        {$push: {address: addedAddress}},
      {new: true}
      )
      return addedAddressToUser
    }else{
      logger.error("error adding address")
    }
  },

  getAddress: async function(userId, addressId){
    const userAddress = await User.findOne(
      { _id: userId, 'address._id': addressId }, 
      { 'address.$': 1 } 
    ).lean();
    const address = userAddress.address[0]
    const user = await User.findOne({_id: userId}).lean()
    return{ user, address}
    
  },

  editAddress: async function(userId,addressId, address){
    console.log(address)
   const updatedAddress = await Address.findByIdAndUpdate(
    addressId,
    {$set: {
      houseName: address.houseName,
      street: address.street,
      city: address.city,
      pincode: address.pincode
    }
    },
    {new: true}
   )
   
   const user= await User.findOneAndUpdate(
     {_id: userId, 'address._id': addressId},
     {$set: {"address.$": updatedAddress}},
     {new: true}
     )
     console.log(user)
  },
  deleteAddress : async function(userId, addressId){
    const deleteAddress = await Address.findByIdAndDelete(
      addressId,
    )
    const delUserAddress = await User.findByIdAndUpdate(
      {_id: userId},
      {$pull: {address: {_id: addressId}}},
      {new: true}
    )
    return delUserAddress;
  }
};
