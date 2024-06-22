const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndexPage = (req, res, next) => {
  //this find() method is provided by the mongoose and returns all the data that is
  //present in the db
  Product.find()
    // .select('title price -_id') // we can select the fields that we need through this method
    //and if we want to omit any field then just write -<field-name>

    // .populate('userId', 'name email')  this method is used to get the specific nested
    //data that we need suppose I have embedded userId in the product document then
    //I can retrieve all the data regarding that embeddedId which belongs to the
    //different collection
    .then((result) => {
      console.log(result);
      res.render("shop/product_list", {
        products: result,
        pageTitle: "Shop",
        path: "/",
        hasProducts: result.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductsData = (req, res, next) => {
  // console.log('inside shop: ', products);
  Product.find()
    .then((result) => {
      res.render("shop/product_list", {
        products: result,
        pageTitle: "Products",
        path: "/products",
        hasProducts: result.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const prodID = req.params.productID;
  // console.log('inside prod details', prodID);
  //this findById() method is provided by the mongoose and its not user defined
  Product.findById(prodID)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/product",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCartData = (req, res, next) => {
  //magic method as cart belongs to many products
  req.user
    .populate("cart.items.productId") // will retrieve the productIds for the
    //products which are in user's cart from which the populate() method is called
    //upon
    // .execPopulate() //it will return a promise unlike to populate()
    .then((user) => {
      console.log(user.cart.items);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCartData = (req, res, next) => {
  // console.log('inside postCart: ');
  const prodID = req.body.productID;

  //getting product which is to be added in the cart

  Product.findById(prodID)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("product added to cart");
      res.redirect("/cart");
    });
};

exports.deleteCartItem = (req, res, next) => {
  const prodID = req.body.productID;
  console.log(prodID);
  req.user
    .deleteCartItem(prodID)
    .then((products) => {
      console.log(products);
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
      //we want to add cart items to the orders thats why we will get the cart items
      //first and then we will add it into the orders
      const products = user.cart.items.map((item) => {
        return { product: { ...item.productId._doc }, quantity: item.quantity };
        //the ._doc method is used to get only the relevant information from the json
        //object
      }); //got the cart items in a list

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
  // console.log('inside shop: ', products);
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
