const { validationResult } = require("express-validator/lib/validation-result");
const fileSystem = require("fs");
const path = require("path");

const io = require("../socket");
const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.currentPage || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find().populate("creator")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    console.log(posts);
    if (!posts) {
      const error = new Error("Posts not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Posts fetched successfully !",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(422).json({
      message: "Invalid param value",
      error: errors,
    });
  }
  const postId = req.query.postId;

  try {
    const post = await Post.findById({ _id: postId });
    if (!post) {
      throw (new Error("Post not found").statusCode = 404);
    }

    return res.status(200).json({
      message: "Post fetched successfully !",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.array().length == 0) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  // if(!req.file) {
  //   const error = new Error('No image provided');
  //   error.statusCode = 422;
  //   throw error;
  // }

  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/cmd.png",
    creator: req.userId,
  });
  try {
    const p = await post.save();
    const user = await User.findById(req.userId);
    console.log(user);
    creator = user;
    user.posts.push(post);
    const result = await user.save();

    io.getIO().emit("post", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    }); // will notify all
    //clients about the new post creation, action and event name are custom

    return res.status(201).json({
      message: "Post created successfully !",
      post: post,
      creator: { id: creator._id, name: creator.name },
    });
  } catch (err) {
    // console.log("error: ", err);
    if (!err.statusCode) {
      //If the error is not because of validation and some else
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.array().length == 0) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.query.postId;

  const title = req.body.title;
  const content = req.body.content;
  // const imageUrl = req.file.image;

  // if(req.file) {
  //   imageUrl = req.file.path;
  // }

  // if(!req.file) {
  //   throw new Error("No file picked").statusCode = 422;
  // }
  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      throw (new Error("Post not found").statusCode = 404);
    }

    if (post.creator._id.toString() !== req.userId) {
      throw (new Error("Forbidden").statusCode = 403);
    }

    // if(imageUrl !== post.imageUrl) {
    //   deleteFile(post.imageUrl);
    // }
    post.title = title;
    post.content = content;
    const result = await post.save();
    io.getIO().emit("post", {
      action: "update",
      post: post,
    });
    return res.status(200).json({
      message: "Post updated successfully",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.query.postId;

  const post = await Post.findById(postId);
  if (!post) {
    throw (new Error("Post not found").statusCode = 404);
  }

  if (post.creator.toString() !== req.userId) {
    const error = new Error("Action forbidden");
    error.statusCode = 403;
    throw error;
  }

  // deleteFile(post.imageUrl);
  try {
    await Post.deleteOne({ _id: postId });
    const user = await User.findById(req.userId);
    user.posts.pull(postId); //for removing the post which is deleted from the user's object
    await user.save();
    io.getIO().emit("post", {
      action: "delete",
      post: postId ,
    }); // will notify all
    //clients about the new post creation, action and event name are custom
    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deleteFile = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fileSystem.unlink(filePath, (err) => console.log(err));
};
