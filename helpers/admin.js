const Coupons = require('../models/coupon');


module.exports={
    addCoupon : async function(body){
        const couponAdd = await Coupons.create({
            name: body.name,
            code: body.code,
            totalPrice: body.totalPrice,
            discount: body.discount,
            expire: body.date
        })
        
    }
}