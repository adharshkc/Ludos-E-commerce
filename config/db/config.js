var mongoose = require("mongoose");
var db = mongoose.connection;

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, {});

db.once("open", () => console.log("Connected to Mongoose "));
db.on("error", (error) => console.error(error));
db.on("disconnected", () => {
  console.log("Mongoose Disconnected");
});

module.exports = mongoose.connection;
