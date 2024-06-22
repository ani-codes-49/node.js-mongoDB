const express = require('express');

const router = express.Router();

const adminData = require('../controllers/admin');

router.get('/add-product', adminData.getAddProducts);

router.get('/products', adminData.getAdminEditProducts);

router.post('/delete-product', adminData.postAdminDeleteProducts);

router.get('/edit-product/:productID', adminData.getAdminEditProducts);

router.post('/edit-product/', adminData.postAdminEditProducts);

router.post('/add-product', adminData.postAddProducts);

exports.router = router;