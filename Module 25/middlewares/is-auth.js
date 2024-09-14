const { header } = require("express-validator");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const headers = req.get("Authorization");

  if (!headers) {
    req.isAuth = false;
    // const error = new Error("No Authorization.");
    // error.statusCode = 401; //not auth
    // throw error;
    return next();
  }
  //getting header info
  const token = headers.split(" ")[1];  // Authorization <token> => split(" ")[1] => <token>
  let decodedToken; // that will contain the info that is present in the token

  try {
    decodedToken = jwt.verify(token, "SomeSecretKeySomeScretKey");
  } catch (err) {
    req.isAuth = false;
    // const error = new Error("No Authorization.");
    // error.statusCode = 401; //not auth
    // throw error;
    return next();
  }

  if (!decodedToken) {
    // If token data is extracted but jwt cannot verify the token data
    req.isAuth = false;
    // const error = new Error("No Authorization.");
    // error.statusCode = 401; //not auth
    // throw error;
    return next();
  }
  
  req.userId = decodedToken.userId; // storing the data in the request that is 
  //extracted from the token for using it everywhere else in the app for the current
  req.isAuth = true;
  next();
};
