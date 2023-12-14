const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const hbs = require("express-handlebars");
const path = require('path')

const adminRouter = require("./routes/admin");
const orderRouter = require("./routes/order");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const connectDb = require("./db/config");

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.use(express.static(__dirname + '/public'))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

connectDb();
app.use("/", adminRouter);
app.use("/", orderRouter);
app.use("/", productRouter);
app.use("/", userRouter);

app.listen(port, () =>
  console.log(`Alpha E-comm app listening on port ${port}!`)
);
