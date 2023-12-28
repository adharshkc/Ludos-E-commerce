const Cart = require("../models/cart")
const addItemsToCart = require("../helpers/cart")





/*************************************************CART*************************************************************/

const addToCart = async function(req, res){
    const userId = req.session.userid
 addItemsToCart.addItemsToCart(req.session.userid, req.params.id)


//   const cart = await Cart.findOne({ user: req.session.userid }); // Find the user's cart

// if (cart) {
//   const existingItemIndex = cart.items.findIndex(item => item.product.toString() === req.params.id);
  
//   if (existingItemIndex !== -1) {
//     await Cart.updateOne(
//       { user: req.session.userid, 'items.product': req.params.id },
//       { $inc: { 'items.$.quantity': 1 } }
//     );
//   } else {
   
//     await Cart.updateOne(
//       { user: req.session.userid },
//       { $push: { items: { product: req.params.id, quantity: 1 } } }
//     );
//   }
// } else {
  
//  const cart = await Cart.create({
//     user: req.session.userid,
//     items: [{ product: req.params.id, quantity: 1 }],
    
//   });
// }

  res.redirect("/products")
}


const getCart = async function(req, res){
    if (req.session.user) {
        const userId = req.session.userid
        let isUser = true;
        const cart = await Cart.findOne({user: userId}).populate('items.product').lean()
        
        res.render("user/cart", { layout: "../layouts/layout", isUser, cart: cart });
      }
}

const updateCart = async function(req, res){

}

module.exports = {addToCart, getCart}