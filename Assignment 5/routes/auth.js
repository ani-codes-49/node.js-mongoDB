const express = require("express");
const User = require("../models/user");
const authController = require("../controllers/auth");
const router = express.Router();

const { check, body } = require("express-validator");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email. Please enter a valid email")
      .custom((val, { req }) => {
        User.findOne({ email: val }).then((user) => {
          //we will only verify user if he is present in the db
          if (!user) {
            return new Error("No user present with given email id");
          }
        });
      }),
    body("password", "Please enter a valid password")
      .isLength({ min: 6 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid email. Please enter a valid email")
      .custom((value, { req }) => {
        // console.log('inside custom', req.body.email);
        User.findOne({
          email: req.body.email,
        })
          .then((user) => {
            //checkin if we already have an existing user with the same email
            //If not we can continue creating a user further
            if (user) {
              console.log("user already present");
              //this is async validation
              //express will decide the result of the promise as true or false by
              //checking whether the promise returns reject or null if its reject then
              //false or else true
              return Promise.reject("Email id already exists");
            }
          })
          .catch((err) => {
            console.log("inside error");
          });
      }),
    body("password", "Please enter a valid password")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email is forbidden");
        // }
        // return true;
      }),
    //these custom validators need to return true or false depending on the business
    //logic
    body("confirmPassword", "Please enter a valid passwords").custom(
      (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }
    ),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);

router.post(
  "/reset",
  check("email").notEmpty().withMessage("Enter something"),
  authController.postReset
);

//this is a different route as this can receive token as an parameter
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/new-password",
  check("password").notEmpty().withMessage("Enter something"),
  authController.postNewPassword
);

exports.router = router;
