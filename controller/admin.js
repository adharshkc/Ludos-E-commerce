const { User, DeletedUser } = require("../models/user");
const orderHelper = require("../helpers/order")
const adminHelper = require("../helpers/admin")

const getUsers = async function (req, res) {
  const users = await User.find().lean();
  res.render("admin/users", {users: users})
};

const admin = async function(req, res){
  
  const orders = await orderHelper.getAllOrder()
  console.log(orders.orderid)

    
    res.render("admin/index",{orders: orders})
  
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
