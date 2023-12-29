const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const hbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const morgan = require("morgan")
const bodyParser = require('body-parser')

const adminRouter = require("./routes/admin");
const orderRouter = require("./routes/order");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const connectDb = require("./db/config");

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
    store: new MongoDBStore({mongooseConnection: connectDb})
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
app.use(morgan("tiny"))

// connectDb();
app.use("/", adminRouter);
app.use("/", orderRouter);
app.use("/", productRouter);
app.use("/", userRouter);

app.listen(port, () =>
  console.log(`Alpha E-comm app listening on port ${port}!`)
);
