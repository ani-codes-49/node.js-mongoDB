const express = require('express');
const router = express.Router();
const shopData = require('../controllers/shop');

router.get('/', shopData.getIndexPage);

router.get('/products', shopData.getProductsData);

router.get('/product-details/:prodID', shopData.getProductDetails);

router.get('/cart', shopData.getCartData);

router.post('/cart', shopData.postCartData);

router.post('/cart-delete-item', shopData.deleteCartItem);

router.get('/orders', shopData.getOrdersData);

module.exports = router; 