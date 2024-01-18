const { User, DeletedUser } = require("../models/user");
const orderHelper = require("../helpers/order")
const adminHelper = require("../helpers/admin")

const getUsers = async function (req, res) {
  const users = await User.find().lean();
  res.render("admin/users", {users: users})
};

const admin = async function(req, res){
  
  const orders = await orderHelper.getAllOrder()
  const sortedOrder = orders.reverse()
  const result = await adminHelper.totalAmount()
  const daily = await adminHelper.dailyOrderAmount()
  const totalAmount = result[0].totalAmount
  if(daily.length ==0){
    const dailyAmount = 0;
    res.render("admin/index",{orders: sortedOrder,totalAmount: totalAmount, dailyAmount: dailyAmount})

  }else{
    const dailyAmount = daily[0].totalAmount
    console.log(orders.orderid)
  
      
      res.render("admin/index",{orders: orders,totalAmount: totalAmount, dailyAmount: dailyAmount})
    

  }
}


const deleteUser = async function (req, res) {
  try {
    const deleteUser = await adminHelper.deleteUser(req.params.id);
   if(deleteUser){
    res.redirect("/admin/users")
   }
  } catch (err) {
    res.status(404);
    console.log(err);
  }
};

const getAddCoupon = async function(req, res){
  res.render('admin/add-coupons')
}

const addCoupon = async function(req, res){
  const addedCoupon = adminHelper.addCoupon(req.body)
}



module.exports = {
  admin,
  getUsers,
  // editUser,
  deleteUser,
  getAddCoupon,
  addCoupon
};
