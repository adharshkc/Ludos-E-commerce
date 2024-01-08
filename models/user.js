const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  houseName: String,
  street: String,
  city: String,
  pincode: String,
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter your name"],
      minLength: [3, "Name is too short"],
      maxLength: [20, "Name is very big"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      minLength: [3, "please enter a valid email"],
      maxLength: [64, "Please enter a valid email"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [4, "Password should be greater than 4 characters"],
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
      required: true,
      maxLength: [10, "invalid phone number"],
    },
    address: [addressSchema],
    role: {
      type: String,
      default: "user",
    },
    cart: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          index: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, 
        },
      },
    ],
  },
  { timestamps: true }
);

/******************************************************SAVE PASSWORD****************************************************************/
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/******************************************************COMPARE PASSWORD****************************************************************/
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const deletedUserSchema = mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "deleted",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);
const Address = mongoose.model("Address", addressSchema);
const DeletedUser = mongoose.model("DeletedUsers", deletedUserSchema);
module.exports = { User, DeletedUser, Address };
