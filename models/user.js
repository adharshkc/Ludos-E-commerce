const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [4, "Password should be greater than 4 characters"],
    },
    phone: {
      type: Number,
      trim: true,
    },
    address: {
      houseName: {
        type: String,
      },
      city: {
        type: String,trim: true,
      },
      pincode: {
        type: Number,
        trim: true,
      },
    },
    role: {
      type: String,phone: Number,
      default: "user",
    },
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

const deletedUserSchema = mongoose.Schema({
  name: String,

  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "deleted"

  }
});

const User = mongoose.model("Users", userSchema);
const DeletedUser = mongoose.model("DeletedUsers", deletedUserSchema);
module.exports = { User, DeletedUser };
