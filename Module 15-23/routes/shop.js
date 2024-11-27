const express = require("express");

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

const shopData = require("../controllers/shop");

router.get("/", isAuth, shopData.getIndexPage);

router.get("/products", isAuth ,shopData.getProductsData);

router.get("/product-details/:productID", isAuth, shopData.getProductDetails);

router.get("/cart", isAuth, shopData.getCartData);

router.post("/cart", isAuth, shopData.postCartData);

router.post("/cart-delete-item", isAuth, shopData.deleteCartItem);

router.post("/create-order", isAuth, shopData.postOrdersData);

router.get('/checkout', isAuth, shopData.getCheckout);

router.get('/checkout/success', shopData.getCheckoutSuccess);

router.get('/checkout/cancel', shopData.getCheckout);

router.get("/orders", isAuth, shopData.getOrdersData);

router.get('/orders/:orderId', isAuth, shopData.getInvoice);

exports.router = router;
