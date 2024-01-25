const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const hbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const passport = require("passport");

const adminRouter = require("./routes/admin");
const orderRouter = require("./routes/order");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const connectDb = require("./config/db/config");
require("./config/passport-config/localStrategy");
require("./config/passport-config/googleAuth");
require("./config/passport-config/facebookAuth");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());

//header cache remove

app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 * 24 },
    store: new MongoDBStore({ mongooseConnection: connectDb }),
  })
);

app.use(passport.initialize());
//passport session
app.use(passport.session());

//handlebars
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

// connectDb();
app.use("/", adminRouter);
app.use("/", orderRouter);
app.use("/", productRouter);
app.use("/", userRouter);
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.satus = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("user/error", {
    message: err.message,
    error: app.get("env") === "development" ? err : {},
  });
});

app.listen(port, () =>
  console.log(`Alpha E-comm app listening on port ${port}!`)
);
