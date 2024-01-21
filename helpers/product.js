const Products = require("../models/product");

module.exports = {
  getProduct: async function (proId) {
    const product = await Products.findOne({ _id: proId }).lean();
    return product;
  },

  getAllProduct: async function () {
    const products = await Products.find().lean();
    return products;
  },

  editProduct: async function (proId, body) {
    console.log(body);
    const editProduct = await Products.findByIdAndUpdate(proId, body, {
      new: true,
    });
    console.log(editProduct);
    return editProduct;
  },

  deleteProduct: async function (proId) {
    const deleteProduct = await Products.findByIdAndDelete(proId);
    return deleteProduct;
  },

  productSearch: async function (data) {
    const result = await Products.find({
      name: { $regex: `^${data}`, $options: "i" },
    }).lean();
    return result;
  },
};
