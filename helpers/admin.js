const Coupons = require("../models/coupon");
const Product = require("../models/product");

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
};
