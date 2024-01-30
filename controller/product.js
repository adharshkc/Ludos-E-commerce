  const Products = require("../models/product");
const adminHelper = require("../helpers/admin");
const productHelper = require("../helpers/product");
const { logger } = require("../utils/logger");
const {} = productHelper

/************************************************************GET PRODUCTS PAGE**************************************************** */

const showProduct = async function (req, res) {
  const products = await productHelper.getAllProduct();
  if (req.session.user) {
    let isUser = true;
    res.render("user/products", { products: products, isUser });
  } else {
    res.render("user/products", { products: products });
  }
};

/************************************************************ SINGLE PRODUCT PAGE**************************************************** */

const singleProduct = async function (req, res) {
  const productId = req.params.id;
  // console.log(productId)
  const product = await productHelper.getProduct(productId);
  if (req.session.user) {
    let isUser = true;
    res.render("user/product", { product, isUser });
  } else {
    res.render("user/product", { product });
  }
};

/************************************************************POST ADMIN ADD PRODUCT**************************************************** */

const addProduct = async function (req, res) {
  console.log("image : "+req.body.image);
  const { upload } = require("../middlewares/multer");
  const uploadMiddleware = upload();

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error uploading file.");
    }

    const fileName = req.file.filename;
    const addedProduct = await adminHelper.addProduct(req.body, fileName);
    if (addedProduct) {
      res.redirect("/admin/products");
    }
  });
};

const getAddProduct = function (req, res) {
  res.render("admin/add-product");
};

const adminProduct = async function (req, res) {
  const products = await productHelper.getAllProduct();
  res.render("admin/products", { products: products });
};

/************************************************************ ADMIN EDIT PRODUCT**************************************************** */

const edit_product = async function (req, res) {
  const proId = req.params.id;
  const product = await productHelper.getProduct(proId);
  res.render("admin/edit-product", { product: product });
};

const editProduct = async function (req, res) {
  try {
    const editedProduct = await productHelper.editProduct(
      req.params.id,
      req.body
    );

    if (editedProduct) {
      res.redirect("/admin/products");
    }
  } catch (err) {
    res.status(404);
    console.log(err);
  }
};

/************************************************************POST ADMIN DELETE PRODUCTS**************************************************** */

const deleteProduct = async function (req, res) {
  console.log("delete");
  try {
    console.log(req.params.id);
    const deletedProduct = await productHelper.deleteProduct(req.params.id);
    if (deletedProduct) {
      res.redirect("/admin/products");
    }
  } catch (err) {
    res.status(404);
    res.json("error deleting product");
  }
};

const searchProduct = async function (req, res) {
  try {
    const data = req.body.search;
    console.log(data)
    const products = await productHelper.productSearch(data)
    console.log(products)
    if(products.length>=1){
      if (req.session.user) {
        let isUser = true;
        res.render("user/products", { products: products, isUser });
      } else {
        res.render("user/products", { products: products });
      }
    }else{
      const noProduct = true
      if(req.session.user){
        let isUser = true
        console.log("no product",noProduct);
        res.render("user/products", { isUser, noProduct });

      }else{
        res.render("user/products", { noProduct });
      }
    }
  } catch (error) {
    console.log(error)
    logger.error({ message: "error searching product" });
  }
};

module.exports = {
  addProduct,
  editProduct,
  showProduct,
  edit_product,
  deleteProduct,
  singleProduct,
  getAddProduct,
  adminProduct,
  searchProduct,
};
