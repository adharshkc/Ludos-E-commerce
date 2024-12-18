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
  const { upload } = require("../middlewares/multer");
  const uploadMiddleware = upload().array('images', 5);

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error uploading file.");
    }

    const fileNames = req.file.map(file=>file.filename);
    const addedProduct = await adminHelper.addProduct(req.body, fileNames);
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
  try {
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
    const products = await productHelper.productSearch(data)
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
        res.render("user/products", { isUser, noProduct });

      }else{
        res.render("user/products", { noProduct });
      }
    }
  } catch (error) {
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
