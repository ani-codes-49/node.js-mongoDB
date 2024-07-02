const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  // console.log("inside admin get");
  // const isLoggedIn = req.get("Cookie").split(';')[0].trim().split(':')[1].trim() === 'true';
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProducts = (req, res, next) => {
  // console.log('inside post add');
  var request = req.body;

  const product = new Product({
    title: request.title,
    price: request.price,
    imageUrl: request.imageUrl,
    description: request.description,
    userId: req.user._id,
  });

  //now the mongoose provides the default save method for saving the data inside the db
  product
    .save()
    .then((result) => {
      // console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getAdminEditProducts = (req, res, next) => {
  const prodID = req.params.productID;
  const isEditing = req.query.edit;

  if (isEditing == "false") {
    Product.find({
      userId: req.user._id,
    })
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  } else {
    Product.findById(prodID)
      .then((product) => {
        res.render("admin/edit-product", {
          product: product,
          pageTitle: "Admin Products",
          path: "/admin/products",
          editing: isEditing,
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  }
};

exports.postAdminEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  //here we find the product by its id and mongoose returns us a complete mongoose
  //object so that we call save on that object so that mongoose updates the existing
  //product instead of adding a new one
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      product.userId = req.user._id;
      return product.save().then(() => {
        console.log("product modified");
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postAdminDeleteProducts = (req, res, next) => {
  const prodID = req.query.id;

  Product.deleteOne({_id: prodID, userId: req.user._id})
    .then(() => {
      console.log("Product deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};