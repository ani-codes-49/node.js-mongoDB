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
        return true;
      })
      .trim()
      .normalizeEmail(),
    body("password", "Please enter a valid password")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
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
      .normalizeEmail()
      .trim(),
    body("password", "Please enter a valid password")
      .isLength({ min: 6 })
      .trim(),
    //these custom validators need to return true or false depending on the business
    //logic
    body("confirmPassword", "Please enter a valid passwords")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      })
      .trim(),
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
