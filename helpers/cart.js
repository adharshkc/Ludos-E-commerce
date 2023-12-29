const Cart = require("../models/cart");
const Product = require("../models/product");

// module.exports = {
//     addItemsToCart:async function(userId, proId){
//         console.log(userId)
//         const cart = await Cart.findOne({ user: userId }).populate('items.product'); // Find the user's cart

//         if (cart) {
//           const existingItemIndex = cart.items.findIndex(item => item.product.toString() === proId);

//           if (existingItemIndex !== -1) {
//             await Cart.updateOne(
//               { user: userId, 'items.product': proId },
//               { $inc: { 'items.$.quantity': 1 } }
//             );
//           } else {

//             await Cart.updateOne(
//               { user: userId },
//               { $push: { items: { product: proId, quantity: 1 } } }
//             );
//           }
//         } else {

//          const cart = await Cart.create({
//             user: userId,
//             items: [{ product: proId, quantity: 1 }],

//           });
//         }
//     }
// }

module.exports = {
  addItemsToCart: async function (userId, proId) {

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.product._id.toString() === proId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newProduct = await Product.findById(proId);
        cart.items.push({ product: newProduct, quantity: 1 });
      }

      await cart.save();
    } else {
      const newProduct = await Product.findById(proId);
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: newProduct, quantity: 1 }],
        // totalPrice: newProduct.price || 0,
      });
    }
  },
};
