const express = require("express");
require("dotenv").config({path:"./config/.env"});

const adminRouter = require("./routes/admin");
const orderRouter = require("./routes/order");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const connectDb = require('./db/config')

const app = express();
const port = process.env.PORT;
app.use(express.json());

connectDb()
app.use("/", adminRouter);
app.use("/", orderRouter);
app.use("/", productRouter);
app.use("/", userRouter);

app.listen(port, () =>
  console.log(`Alpha E-comm app listening on port ${port}!`)
);
