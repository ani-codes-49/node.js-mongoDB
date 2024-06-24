const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(';')[0].trim().split(':')[1].trim() === 'true';
  // console.log(req.get('Cookie'));

  // console.log("is logged in : ", req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("66785217a2bb67e72aa28e05")
    .then((user) => {
      req.session.user = user;
      req.session.cookie = {
        createdAt: new Date().getHours() + new Date().getMinutes(),
      }
      req.session.isLoggedIn = true;
      //here we are using callback in save function and redirecting only after the 
      //sessions has been saved It can avoid situations like redirecting before session
      //being stored and showing content according to the session state(which might 
      //not get stored)
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.getLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    console.log("error while logging out: ", err);
    console.log("Logged out");
    res.redirect("/");
  });
};
