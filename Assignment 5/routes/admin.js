const express = require('express');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

const adminData = require('../controllers/admin');

router.get('/add-product', isAuth, adminData.getAddProducts);

router.post('/add-product', isAuth, adminData.postAddProducts);

router.get('/products', isAuth, adminData.getAdminEditProducts);

router.get('/edit-product/:productID', isAuth, adminData.getAdminEditProducts);

router.post('/delete-product', isAuth, adminData.postAdminDeleteProducts);

router.post('/edit-product/', isAuth, adminData.postAdminEditProducts);


exports.router = router;