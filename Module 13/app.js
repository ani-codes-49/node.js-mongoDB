const express = require("express");
const bodyParer = require("body-parser");
const path = require("path");
const root_dir = require("./util/root_path");

const app = express();
const mongoose = require("mongoose");

const admin = require("./routes/admin");
const user = require("./routes/shop");

const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParer.urlencoded({ extended: false }));
app.use(express.static(path.join(root_dir.rootPath, "public")));

app.use((req, res, next) => {
  User.findById("667429f12ff7f0984f5933b4")
    .then((user) => {
      //storing the user data in the request so that we can access the user
      //object and its associated data from anywhere in the app
      // console.log(user);
      if(user) {
        req.user = user;
        // console.log('user exists');
      }

      next();
      // console.log(user);
      //calling the next() method so that we will continue the flow of execution
    })
    .catch((err) => console.log(err));
});

app.use("/admin", admin.router);
app.use(user.router);

app.use("", (req, res, next) => {
  res.render("error.ejs", {
    pageTitle: "Page not found",
    path: "/page-not-found",
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
