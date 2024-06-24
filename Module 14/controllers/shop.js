const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndexPage = (req, res, next) => {
  Product.find()
    .then((result) => {
      // console.log(result);
      res.render("shop/product_list", {
        products: result,
        pageTitle: "Shop",
        path: "/",
        hasProducts: result.length > 0,
        activeShop: true,
        productCSS: true,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductsData = (req, res, next) => {
  Product.find()
    .then((result) => {
      res.render("shop/product_list", {
        products: result,
        pageTitle: "Products",
        path: "/products",
        hasProducts: result.length > 0,
        activeShop: true,
        productCSS: true,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const prodID = req.params.productID;

  Product.findById(prodID)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/product",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCartData = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user.cart.items);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCartData = (req, res, next) => {
  const prodID = req.body.productID;

  Product.findById(prodID)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log("product added to cart");
      res.redirect("/cart");
    });
};

exports.deleteCartItem = (req, res, next) => {
  const prodID = req.body.productID;
  console.log(prodID);
  req.user
    .deleteCartItem(prodID)
    .then((products) => {
      // console.log(products);
      let product = products[0];
      //magic method
      if (product) return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrdersData = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { product: { ...item.productId._doc }, quantity: item.quantity };
      });

      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrdersData = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
