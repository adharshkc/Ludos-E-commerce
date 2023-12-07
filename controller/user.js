const express = require("express");

const userLogin = function (req, res) {
  res.send("hello");
};

const user_signin = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  console.log(`email : ${email}, password: ${password}`);
};

const user_registration = function(req, res){

}

module.exports = { userLogin, user_signin, user_registration };
