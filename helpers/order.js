const Razorpay = require("razorpay")

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
})





module.exports = {
  
    generateRazorpay: (orderId, totalPrice)=>{
        return new Promise((resolve, reject)=>{
          console.log(orderId)
            var options = {
                amount: totalPrice*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId
              };
              instance.orders.create(options, function(err, order) {
                if(err){
                    console.log(err)
                }else{
                // console.log("your order",order);
                resolve(order)
                }
              });

        })
    },
    // verifyPayment: function(details){
    //     return new Promise((resolve, reject)=>{
    //         const crypto = require('crypto')
    //         const hmac = 
    //     })
    // }
}