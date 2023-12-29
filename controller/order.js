const Cart = require("../models/cart");
const addItemsToCart = require("../helpers/cart");

/*************************************************CART*************************************************************/

const addToCart = async function (req, res) {
  const userId = req.session.userid;
  addItemsToCart.addItemsToCart(req.session.userid, req.params.id);

  res.redirect("/products");
};

const addProductToCart = async function (req, res) {
  addItemsToCart.addItemsToCart(req.session.userid, req.params.id).then(()=>{

    res.redirect("/cart");
  })
};

const getCart = async function (req, res) {
  if (req.session.user) {
    const userId = req.session.userid;
    let isUser = true;
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .lean();
    if (cart) {
      let totalPrice = 0;
      for (const item of cart.items) {
        totalPrice += item.quantity * item.product.price;
      }
      console.log(totalPrice);
      res.render("user/cart", {
        layout: "../layouts/layout",
        isUser,
        cart: cart,
        totalPrice,
      });
    }
  }
};

const deleteCart = async function (req, res) {
  const userId = req.session.userid;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log(req.params.id);
    const productId = req.params.id;
    const indexToRemove = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (indexToRemove === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    cart.items.splice(indexToRemove, 1);

    await cart.save();

    res.redirect("/cart");
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updateCart = async function (req, res) {
  const { proId, count } = req.body;
  const userId = req.session.userid;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const result = await Cart.updateOne(
      { user: userId, "items.product": proId },
      { $inc: { "items.$.quantity": count } },
      {
        $set: {
          totalPrice: {
            $reduce: {
              input: "$items",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  { $multiply: ["$$this.product.price", "$$this.quantity"] },
                ],
              },
            },
          },
        },
      }
    );

    console.log("Cart updated successfully");
    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};



///////////////////////////////////////////////////////////////CHECKOUT/////////////////////////////////////////////////////


module.exports = {
  addToCart,
  getCart,
  addProductToCart,
  deleteCart,
  updateCart,
};
