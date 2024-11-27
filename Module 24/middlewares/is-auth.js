const { header } = require("express-validator");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const headers = req.get("Authorization");

  if (!headers) {
    const error = new Error("No Authorization.");
    error.statusCode = 401; //not auth
    throw error;
  }
  //getting header info
  const token = headers.split(" ")[1];  // Authorization <token> => split(" ")[1] => <token>
  let decodedToken; // that will contain the info that is present in the token

  try {
    decodedToken = jwt.verify(token, "SomeSecretKeySomeScretKey");
  } catch (err) {
    const error = new Error("No Authorization.");
    error.statusCode = 401; //not auth
    throw error;
  }

  if (!decodedToken) {
    // If token data is extracted but jwt cannot verify the token data

    const error = new Error("No Authorization.");
    error.statusCode = 401; //not auth
    throw error;
  }

  req.userId = decodedToken.userId; // storing the data in the request that is 
  //extracted from the token for using it everywhere else in the app for the current
  next();
};
