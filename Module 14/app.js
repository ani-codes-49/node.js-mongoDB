const express = require("express");
const bodyParer = require("body-parser");
const path = require("path");
const root_dir = require("./util/root_path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const mongoose = require("mongoose");

const admin = require("./routes/admin");
const user = require("./routes/shop");
const auth = require("./routes/auth");
const User = require("./models/user");

const store = new MongoDBStore({
  uri: "mongodb+srv://aniruddhkarekar1:hHFdkybiuBDtiJBM@cluster0.2bhulxe.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0",
  collection: "sessions",
  maxAge: 10000,
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParer.urlencoded({ extended: false }));
app.use(express.static(path.join(root_dir.rootPath, "public")));
app.use(
  session({
    secret: "ldsjfklsefjsdlfksjflksdf",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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

mongoose
  .connect(
    "mongodb+srv://aniruddhkarekar1:hHFdkybiuBDtiJBM@cluster0.2bhulxe.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    //here if we do not specify any constraints in the findOne() method then the
    //mongoose will return the first user that it will find

    User.findOne().then((user) => {
      if (!user) {
        //creating user statically
        const user = new User({
          name: "Aniruddh",
          email: "aniruddhkarekar.1@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save()
      }
    });
    console.log("Connected through mongoose");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
