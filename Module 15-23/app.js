const express = require("express");
const bodyParer = require("body-parser");
const path = require("path");
const root_dir = require("./util/root_path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const app = express();
const mongoose = require("mongoose");

const admin = require("./routes/admin");
const user = require("./routes/shop");
const auth = require("./routes/auth");
const User = require("./models/user");
const csrfProtection = csrf({
  //can specify cookie and session etc.
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    console.log('inside true');
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const store = new MongoDBStore({
  uri: "mongodb+srv://aniruddhkarekar1:hHFdkybiuBDtiJBM@cluster0.2bhulxe.mongodb.net/shop",
  collection: "sessions",
  maxAge: 10000,
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParer.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

app.use(express.static(path.join(root_dir.rootPath, "public")));
app.use('/images', express.static(path.join(root_dir.rootPath, "images")));

app.use(
  session({
    secret: "ldsjfklsefjsdlfksjflksdf",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//we have to define this csrf middleware after creating the session because
//csrf has to use the session

app.use(csrfProtection); // this will validate every non-GET request with the csrf
//token if the token does not get found then it will show an error

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      return new Error(err);
    });
});

app.use((req, res, next) => {
  app.locals.isAuthenticated = req.session.isLoggedIn;
  app.locals.csrfToken = req.csrfToken();
  next();
});
app.use(auth.router);
app.use("/admin", admin.router);
app.use(user.router);

app.use("", (req, res, next) => {
  res.render("error.ejs", {
    pageTitle: "Page not found",
    path: "/page-not-found",
    isAuthenticated: req.session.isLoggedIn,
  });
});

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(
    "mongodb+srv://aniruddhkarekar1:hHFdkybiuBDtiJBM@cluster0.2bhulxe.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    console.log("Connected through mongoose");
    app.listen(1000);
  })
  .catch((err) => console.log(err));
