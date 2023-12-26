const Products = require("../models/product");
const Cart = require("../models/cart")

/************************************************************GET PRODUCTS PAGE**************************************************** */

const showProduct = async function (req, res) {
  const products = await Products.find({}).lean()
  res.render('user/products', {products: products})
};


/************************************************************ SINGLE PRODUCT PAGE**************************************************** */

const singleProduct = async function(req, res){
  const productId = req.params.id;
  // console.log(productId)
  const product = await Products.findOne({_id: productId}).lean()
  // console.log(product+"product")
  res.render('user/product', {product})
}

const postProduct = async function(req, res){
  const cart = await Cart.findOne({user: req.session.useriduser })
  if(cart){
    const existingItem = cart.items.findIndex(item => item.product.toString() === req.params.id)
    if(existingItem !== -1){
      cart.items[existingItem].quantity +=1;
    }else{
      cart.items.push({product: req.params.id, quantity: 1})
    }
    await Cart.save()
  }else{
    const newCart = new Cart({
      user: req.session.userid,
      items: [{ product: req.params.id, quantity: 1 }] // Add the product to a new cart with quantity 1
    });
  }
  res.redirect("/cart")
}

/************************************************************POST ADMIN ADD PRODUCT**************************************************** */

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

const getAddProduct = function(req,res ){
  res.render("admin/add-product")
}

/************************************************************PUT ADMIN EDIT PRODUCT**************************************************** */

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

/************************************************************POST ADMIN DELETE PRODUCTS**************************************************** */

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

module.exports = { addProduct, editProduct, showProduct, deleteProduct, singleProduct, getAddProduct, postProduct };
