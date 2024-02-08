const { User, DeletedUser } = require("../models/user");
const orderHelper = require("../helpers/order");
const adminHelper = require("../helpers/admin");

const getUsers = async function (req, res) {
  const users = await User.find().lean();
  res.render("admin/users", { users: users });
};

const admin = async function (req, res) {
  const orders = await orderHelper.getAllOrder();
  const reversedOrder = orders.reverse();
  const sortedOrder = reversedOrder.slice(0, 10);
  const result = await adminHelper.totalAmount();
  const daily = await adminHelper.dailyOrderAmount();
  const totalAmount = result[0].totalAmount;
  if (daily.length == 0) {
    const dailyAmount = 0;
    res.render("admin/index", {
      orders: sortedOrder,
      totalAmount: totalAmount,
      dailyAmount: dailyAmount,
    });
  } else {
    const dailyAmount = daily[0].totalAmount;

    res.render("admin/index", {
      orders: sortedOrder,
      totalAmount: totalAmount,
      dailyAmount: dailyAmount,
    });
  }
};

const deleteUser = async function (req, res) {
  try {
    const deleteUser = await adminHelper.deleteUser(req.params.id);
    if (deleteUser) {
      res.redirect("/admin/users");
    }
  } catch (err) {
    res.status(404);
    console.log(err);
  }
};

const getAddCoupon = async function (req, res) {
  res.render("admin/add-coupons");
};

const addCoupon = async function (req, res) {
  const addedCoupon = adminHelper.addCoupon(req.body);
};

const updateOrder = async function (req, res) {
  const action = req.query.action;
  const orderId = req.query.orderId;
  const order = await orderHelper.getSingleOrder(orderId);
  let updatedOrder;
  if (
    (action == "shipped" || action == "delivered") &&
    (order.status == "delivered" || order.status == "cancelled")
  ) {
    updatedOrder = null;
    res.json({ updatedOrder });
  } else {
    updatedOrder = await orderHelper.orderUpdate(action, orderId);
    console.log(updatedOrder);
    res.json({ updatedOrder });
  }
};

const filterOrder = async function (req, res) {
  const lowerValue = req.query.l;
  const higherValue = req.query.h;
  const filteredOrder = await orderHelper.filterOrder(lowerValue, higherValue);
  res.render("admin/orders", { orders: filteredOrder });
};

const filterType = async function (req, res) {
  const payType = req.params.type;
  const filteredOrderType = await orderHelper.filterOrderType(payType);
  res.render("admin/orders", { orders: filteredOrderType });
};

const filterDate = async function (req, res) {
  const date = req.params.date;
  const today = new Date();
  today.setHours(0,0,0,0)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 6);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  if(date == 'today'){
    const filteredDate = await orderHelper.dateFilter(today)
    if(filteredDate.length<1){
      let noOrder;
      res.render("admin/orders", {orders: noOrder })

    }
    res.render("admin/orders", {orders: filteredDate})
  }

};

module.exports = {
  admin,
  getUsers,
  deleteUser,
  getAddCoupon,
  filterType,
  updateOrder,
  addCoupon,
  filterOrder,
  filterDate,
};
