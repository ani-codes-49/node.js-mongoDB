exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(';')[0].trim().split(':')[1].trim() === 'true';
  // console.log(req.get('Cookie'));

  console.log('is logged in : ', req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //req.isLoggedIn = true; this req variable will only be accessible only till
  //we don't send a response. After we send a response then the req object will be
  //deleted and therefor we cannot access any data associated with the request object

  req.session.isLoggedIn = true;

  res.redirect("/");
};
