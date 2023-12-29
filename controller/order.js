const Cart = require("../models/cart");
const cart = require("../helpers/cart");
const Order = require("../models/order")
// const deleteCart = require("../helpers/cart")

/*************************************************CART*************************************************************/

const addToCart = async function (req, res) {
  const userId = req.session.userid;
  cart.addItemsToCart(req.session.userid, req.params.id);

  res.redirect("/products");
};

const addProductToCart = async function (req, res) {
  cart.addItemsToCart(req.session.userid, req.params.id).then(()=>{

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
  cart.deleteCartProduct(userId, req.params.id).then(()=>{
    res.redirect("/cart");
  })
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
const getCheckout = async function(req, res){
  if (req.session.user) {
   let isUser= true
  const userId = req.session.userid
  const cart = await Cart.findOne({ user: userId }).populate("items.product").populate("user").lean();
  
  // if (cart) {
    let totalPrice = 0;
    for (const item of cart.items) {
      totalPrice += item.quantity * item.product.price;
    }
    const order = await Order.findOne({cart: cart._id}).lean()
    if(order == null){

      res.render('user/checkout',{isUser, cart: cart, totalPrice})
    }
    
    res.render('user/checkout',{isUser, cart: cart, totalPrice, order})
  // }

}
}

const deleteProductCheckout = async function(req, res){
  cart.deleteCartProduct(req.session.userid, req.params.id).then(()=>{
    res.redirect('/checkout')
  })
}

const postCheckout = async function(req, res){
  console.log(req.body.payment)
  const userId =req.session.userid
  const cart = await Cart.findOne({userId}).populate("items.product")
  let totalPrice = 0
  for(const item of cart.items){
    totalPrice += item.quantity * item.product.price
  }
  console.log(totalPrice)
  
  
    try{

      const order = await Order.create({
        cart: cart._id,
        shippingAddress: {
          houseName: req.body.houseName,
          city: req.body.city,
          pincode: req.body.pincode
        },
        phone: req.body.phone,
        status: "placed",
        totalPrice : totalPrice,
        paymentType: req.body.payment,
        user: userId
      })
      if(req.body.payment == 'COD'){
        res.json({status: true, order})
      }else{
        
      }
    }catch(error){
      res.json({status: false})
    }
  // }

}


module.exports = {
  addToCart,
  getCart,
  addProductToCart,
  deleteCart,
  updateCart,
  getCheckout,
  deleteProductCheckout,
  postCheckout
};
