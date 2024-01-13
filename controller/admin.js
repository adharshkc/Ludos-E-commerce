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

const editUser = async function (req, res) {
  try {
    const editedUsers = await User.findByIdAndUpdate(req.params.id, req.body);
    if (editedUsers) {
      res.json("user edited");
      console.log("user edited");
    } else {
      res.json("error editing users");
      console.log("error editing users");
    }
  } catch (err) {
    res.status(404);
    console.log(err);
  }
};

const deleteUser = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
        res.json("user deleted");
        console.log("user deleted");
    } else {
        res.json("error deleting users");
        console.log("error deleting users");
    }
    const deletedUser = await DeletedUser.create({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    console.log(deletedUser);
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
  editUser,
  deleteUser,
  getAddCoupon,
  addCoupon
};
