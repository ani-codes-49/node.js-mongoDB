const express = require("express");

const { body } = require("express-validator");

const isAuth = require("../middlewares/is-auth");

const router = express.Router();

const adminData = require("../controllers/admin");

router.get("/add-product", isAuth, adminData.getAddProducts);

router.post(
  "/add-product",
  [
    body("title", "Please enter valid title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl", "Please enter valid image url").isURL(),
    body("price", "Please enter valid price").isFloat(),
    body("description", "Please enter valid description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminData.postAddProducts
);

router.get("/products", isAuth, adminData.getAdminEditProducts);

router.get("/edit-product/:productID", isAuth, adminData.getAdminEditProducts);

router.post("/delete-product", isAuth, adminData.postAdminDeleteProducts);

router.post(
  "/edit-product/",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminData.postAdminEditProducts
);

exports.router = router;
