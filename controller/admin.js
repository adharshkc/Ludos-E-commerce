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

module.exports = {
  admin,
  getUsers,
  deleteUser,
  getAddCoupon,
  // shipped,
  // delivered,
  // cancelled,
  updateOrder,
  addCoupon,
  filterOrder,
};
