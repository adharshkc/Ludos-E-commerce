const Cart = require("../models/cart")


module.exports = {
    addItemsToCart:async function(userId, proId){
        console.log(userId)
        const cart = await Cart.findOne({ user: userId }); // Find the user's cart

        if (cart) {
          const existingItemIndex = cart.items.findIndex(item => item.product.toString() === proId);
          
          if (existingItemIndex !== -1) {
            await Cart.updateOne(
              { user: userId, 'items.product': proId },
              { $inc: { 'items.$.quantity': 1 } }
            );
          } else {
           
            await Cart.updateOne(
              { user: userId },
              { $push: { items: { product: proId, quantity: 1 } } }
            );
          }
        } else {
          
         const cart = await Cart.create({
            user: userId,
            items: [{ product: proId, quantity: 1 }],
            
          });
        }
    }
}