const Order = require("../models/order")






const cart = async function(req,res){
    res.render('cart')
}


module.exports = {cart}