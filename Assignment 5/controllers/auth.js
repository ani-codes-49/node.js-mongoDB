const encrypt = require("bcryptjs");
const User = require("../models/user");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: "<YOUR-API-KEY-FROM-AN-EMAIL-SERVICE>",
  })
);

exports.getLogin = (req, res, next) => {
  const error = req.flash("error");
  const success = req.flash("success");

  let errMessage;
  let successMessage;
  if (error.length > 0) {
    errMessage = error[0];
    successMessage = null;
  } else {
    successMessage = success[0];
    errMessage = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errMessage,
    successMessage: successMessage,
    // req.flash("error").length > 0 ? req.flash("error")[0] : null,
  });
};

exports.postLogin = (req, res, next) => {
  //finding user through the email
  const email = req.body.email;
  const password = req.body.password;
  const error = validationResult(req);

  const errorMsg = req.flash("error");
  const success = req.flash("success");

  let errMessage;
  let successMessage;
  if (errorMsg.length > 0) {
    errMessage = errorMsg[0];
    successMessage = null;
  } else {
    successMessage = success[0];
    errMessage = null;
  }

  if (!error.isEmpty()) {
    console.log(error.array());
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: error.array()[0].msg,
      successMessage: successMessage,
    });
  }

  encrypt
    .compare(password, user.password)
    .then((doMatch) => {
      if (doMatch) {
        req.session.user = user;
        req.session.cookie = {
          createdAt: new Date().getHours() + new Date().getMinutes(),
        };
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          console.log(err);
          req.flash("error", "Invalid username or password");
          res.redirect("/");
        });
      } else {
        req.flash("error", "Password do not match");
        console.log("Passwords do not match");
        res.redirect("/login");
      }
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    console.log("error while logging out: ", err);
    console.log("Logged out");
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  const result = req.flash("error");
  let message;
  if (result.length > 0) message = result[0];
  else message = null;

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: error.array()[0].msg,
    });
  }
  //for password encryption
  encrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        email: email,
        password: hashedPassword,
        cart: {
          items: [],
        },
      });
      return newUser.save();
    })
    .then((result) => {
      req.flash("success", "Signed Up Successfully!");
      console.log("User has been created");
      // res.redirect("/login");
      // transporter
      //   .sendMail({
      //     to: user.email,
      //     from: "node@shop.com",
      //     subject: "You have successfully signed up",
      //     html: "<h1>You have successfully signed up !<h1/>",
      //   })
      // .catch((err) => console.log(err));
    });
};

exports.getReset = (req, res, next) => {
  const message = req.flash("error");

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

exports.postReset = (req, res, next) => {
  //we have to add something for the verification of the incoming post request
  //otherwise anyone can send us a post request and we will have nothing to verify
  //its authenticity
  //thats why we will add a token inside a post request so that we can check if the
  //token is valid and if the token is the same as we generated
  // console.log('inside post reset');
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.render("auth/reset", {
      path: "/reset",
      pageTitle: "Reset Password",
      errorMessage: error.array()[0].msg,
    });
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    const email = req.body.email;

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No user with given email id found");
          return res.redirect("/reset");
        }

        //we will add token and expiration date into the user model so that it will be
        //valid throughout the request for changing the password
        user.resetToken = token;
        user.resetTokenExpirationDate = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect(`http://localhost:1000/reset/${token}`);
        //this method creates a new request and deletes the old one
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  console.log("getNew password");
  //getting the token for checking whether the request is valid or not
  const token = req.params.token;
  const message = req.flash("error");
  console.log(token);
  //if the token is same as the one from db and it is not expired then only we will
  //verify
  User.findOne({
    resetToken: token,
    resetTokenExpirationDate: { $gt: Date.now() },
  })
    .then((user) => {
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message.length > 0 ? message[0] : null,
        userId: user._id.toString(), // we are passing user id here because we will
        //need that id while updating the new password
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let newUser;

  const error = validationResult(req);
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpirationDate: {
      $gt: Date.now(),
    },
  }).then((user) => {
    newUser = user;
    //now we also want to store the new password with encryption

    encrypt
      .hash(newPassword, 12)
      .then((hashedPassword) => {
        newUser.password = hashedPassword;
        newUser.resetToken = undefined;
        newUser.resetTokenExpiration = undefined;
        return newUser.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  });
};
