const Coupons = require("../models/coupon");
const Order = require("../models/order");
const Product = require("../models/product");
const { User, DeletedUser } = require("../models/user");

module.exports = {
  addCoupon: async function (body) {
    const couponAdd = await Coupons.create({
      name: body.name,
      code: body.code,
      totalPrice: body.totalPrice,
      discount: body.discount,
      expire: body.date,
    });
  },

  addProduct: async function (body, fileName) {
    const { name, brand, category, price, countInStock } = body;
    const productAdd = await Product.create({
      name: name,
      brand: brand,
      category: category,
      price: price,
      countInStock: countInStock,
      image: `/images/${fileName}`,
    });
    return productAdd
  },

  deleteUser: async function(userId){
    const user = await User.findByIdAndDelete(userId);
    if(user){
      const deletedUser = await DeletedUser.create({
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
      return user;
    }
  },

  totalAmount: async function(){
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalPrice" }
        }
      }
    ]);
    return result
  },

  dailyOrderAmount: async function(){
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day

    const result = await Order.aggregate([
      {
        $match: {
          orderedDate: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalPrice" }
        }
      }
    ]);
    return result
  }
};
