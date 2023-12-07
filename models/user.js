const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
  },
  phone: {
    type: Number,
  },
  address: {
    houseNo: {
      type: Number,
    },
    city: {
      type: String,
    },
    pincode: {
      type: Number,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


/******************************************************SAVE PASSWORD****************************************************************/
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  console.log(this.password.toString())
  this.password = this.password.toString()
  console.log(typeof this.password)
  this.password = await bcrypt.hash(this.password, salt);
});

/******************************************************COMPARE PASSWORD****************************************************************/
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}
const User = mongoose.model("Users", userSchema);
module.exports =User