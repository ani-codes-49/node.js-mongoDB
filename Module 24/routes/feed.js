const express = require("express");

const {
  body,
  param,
} = require("express-validator/lib/middlewares/validation-chain-builders");

const feedController = require("../../Module 25/controllers/feed");

const isAuth = require("../../Module 25/middlewares/is-auth");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// console.log('heress');
router.get(
  "/:postId",
  isAuth,
  [param("postId").trim().isLength({ min: 1 })],
  feedController.getPost
);

// POST /feed/post
router.post(
  "/create-post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.put(
  "/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/:postId", isAuth, feedController.deletePost);

module.exports = router;
