// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const adminSchema = mongoose.Schema({
//   email: {
//     type: String,
//     minLength: [7, "email must contain minimum 7 characters"],
//     maxLength: [20, "email should not contain more than 20 characters"],
//     unique: true,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     maxLength: [20, "password limit exceeded"],
//   },
//   isAdmin: {
//     type: Boolean,
//     default: true,
//   },
// });

// adminSchema.pre("save", async function () {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// adminSchema.methods.matchPassword = async function (enteredpassword) {
//   return await bcrypt.compare(enteredpassword, this.password);
// };

// const Admin = mongoose.model("Admins", adminSchema);
// module.exports = Admin;
