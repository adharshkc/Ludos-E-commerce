const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const hbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");

const adminRouter = require("./routes/admin");
const orderRouter = require("./routes/order");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const connectDb = require("./db/config");
const exp = require("constants");

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.use("/images", express.static(path.join(__dirname, "/images")));
app.set("view engine", "hbs");

connectDb();
app.use("/", adminRouter);
app.use("/", orderRouter);
app.use("/", productRouter);
app.use("/", userRouter);

app.listen(port, () =>
  console.log(`Alpha E-comm app listening on port ${port}!`)
);
