const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  console.log("inside admin get");
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
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
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getAdminEditProducts = (req, res, next) => {
  const prodID = req.params.productID;
  const isEditing = req.query.edit;
  if (isEditing == "false") {
    Product.find()
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
        });
      })
      .catch((err) => console.log(err));
  } else {
    // console.log('inside getAdminEditProducts');
    Product.findById(prodID)
      .then((product) => {
        res.render("admin/edit-product", {
          product: product,
          pageTitle: "Admin Products",
          path: "/admin/products",
          editing: isEditing,
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
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then(() => {
      console.log("product modified");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postAdminDeleteProducts = (req, res, next) => {
  const prodID = req.query.id;

  Product.findByIdAndDelete(prodID)
    .then(() => {
      console.log("Product deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
