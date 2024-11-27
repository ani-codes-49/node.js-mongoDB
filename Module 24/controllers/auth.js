const { validationResult } = require("express-validator/lib/validation-result");
const encrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.array()) {
    const error = new Error("Validation failed. Entered data is incorrect.");
    error.statusCode = 422;
    error.message = errors.array();
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPw = await encrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
    });
    const createdUser = await user.save();
    res.status(201).json({
      message: "User has been created",
      userId: createdUser._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Entered email cannot be found.");
      error.statusCode = 401; //not authenticated
      throw error;
    }
    loadedUser = user;
    const equals = await encrypt.compare(password, user.password);
    if (!equals) {
      const error = new Error("User does not exists.");
      error.statusCode = 401; //not auth
      throw error;
    }

    const token = jwt.sign(
      {
        // method for generating signed token
        //we have to pass the data that should be wrapped inside the token,
        //and some scret key that should be used for generating the token
        email: email,
        userId: loadedUser._id.toString(),
        status: loadedUser.status,
      },
      "SomeSecretKeySomeScretKey",
      {
        expiresIn: "1h", // we can configure the details about the token like when will
        //it expire and so on
      }
    );

    res.status(200).json({
      token: token,
      userId: loadedUser._id.toString(),
      status: loadedUser.status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
