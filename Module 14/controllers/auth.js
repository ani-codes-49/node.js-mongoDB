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
  User.findById("66780f6ce5126412cba3417c")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;

      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
