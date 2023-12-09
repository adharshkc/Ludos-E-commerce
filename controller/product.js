const Products = require("../models/product");

/**************************************************************************************************************** */

const showProduct = async function (req, res) {
  const products = await Products.find({});
  res.send(products);
};

const addProduct = async function (req, res) {
  const { name, image, brand, price, category, description, countInStock } =
    req.body;

  const addedProduct = await Products.create({
    name: name,
    brand: brand,
    category: category,
    price: price,
    description: description,
    countInStock: countInStock,
    image: image,
  });
  if (addedProduct) {
    console.log("product added successfully");
    res.json("product added");
    // res.send(addProduct)
  } else {
    res.status(404);
    res.json("error adding product");
  }
};

const editProduct = async function (req, res) {
  try {
    const editedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (editedProduct) {
      res.json("product edited");
      console.log("product edited");
    } else {
      res.json("error editing product");
      console.log("error editing product");
    }
  } catch (err) {
    res.status(404);
    console.log(err);
  }
};

const deleteProduct = async function (req, res) {
    console.log("delete")
  try {
    console.log(req.params.id)
    const deleteProduct = await Products.findByIdAndDelete(req.params.id);
    console.log(deleteProduct)
    if (deleteProduct) {
      res.json("user deleted successfully");
    }
  } catch (err) {
    res.status(404);
    res.json("error deleting product");
  }
};

module.exports = { addProduct, editProduct, showProduct, deleteProduct };
