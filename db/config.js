const mongoose = require("mongoose");

const connectDb = function () {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("database connected successfully");
  }).catch((err)=>{
    console.log(err)
  })
};

module.exports = connectDb;
