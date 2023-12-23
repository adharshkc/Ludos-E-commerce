const Order = require("../models/order")






const cart = async function(req,res){
    res.render('user/cart')
}


module.exports = {cart}