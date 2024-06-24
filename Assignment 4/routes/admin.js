const express = require('express');

const router = express.Router();

const adminData = require('../controllers/admin');

router.get('/add-product', adminData.getAddProducts);

router.post('/add-product', adminData.postAddProducts);

router.get('/products', adminData.getAdminEditProducts);

router.get('/edit-product/:productID', adminData.getAdminEditProducts);

router.post('/delete-product', adminData.postAdminDeleteProducts);

router.post('/edit-product/', adminData.postAdminEditProducts);


exports.router = router;