const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require("path");
const fileSystem = require("fs");

const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
  test() {
    return {
      text: "Works",
    };
  },

  createUser: async function ({ userInput }, req) {
    // (args, req) args contains all
    //the parameters that are passed to the function

    const errors = [];

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Invalid email" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({
        message: "Invalid password. Please enter a valid password",
      });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });

    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return {
      _id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      status: createdUser.status,
      password: hashedPw,
      posts: createdUser.posts,
    };
  },

  login: async function ({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const equals = await bcrypt.compare(password, user.password);
    if (!equals) {
      const error = new Error("Password is incorrect.");
      error.code = 422; //no authentication
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "SomeSecretKeySomeScretKey",
      {
        expiresIn: "1h",
      }
    );

    return { token: token, userId: user._id.toString() };
  },

  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error("Invalid user.");
        error.code = 401;
        throw error;
      }
      const post = new Post({
        title: postInput.title,
        content: postInput.content,
        imageUrl: postInput.imageUrl,
        creator: user,
      });
      const createdPost = await post.save();
      user.posts.push(createdPost);
      await user.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
    return {
      _id: createdPost._id.toString(),
      title: createdPost.title,
      imageUrl: createdPost.imageUrl,
      content: createdPost.content,
      creator: createdPost.creator,
    };
  },

  getPosts: async function ({ pageNumber }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    if (!pageNumber) {
      pageNumber = 1;
    }

    const perPage = 2;
    try {
      const totalPosts = await Post.find().countDocuments();
      const posts = await Post.find()
        .skip((pageNumber - 1) * perPage)
        .limit(perPage)
        .populate("creator");
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
    return {
      posts: posts.map((p) => {
        return { ...p._doc, _id: p._id.toString() };
      }),
      totalPosts: totalPosts,
    };
  },

  getPost: async function ({ postId }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    try {
      const post = await Post.findOne({ _id: postId }).populate("creator");

      if (!post) {
        const error = new Error("Post not found");
        error.code = 404;
        throw error;
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
    return { post: { ...post._doc }, _id: post._id.toString() };
  },

  updatePost: async function ({ postId, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findOne({ _id: postId }).populate("creator");

    if (!post) {
      const error = new Error("Post not found");
      error.code = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }
    try {
      const updatedPost = await post.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
    };
  },

  deletePost: async function ({ postId }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    try {
      const post = await Post.findOne({ _id: postId });
      if (!post) {
        const error = new Error("Post not found!");
        error.code = 404; // not found
        throw error;
      }

      if (post.creator._id.toString() !== req.userId) {
        const error = new Error("Not authenticated!");
        error.code = 422; // no auth
        throw error;
      }

      await Post.deleteOne({ _id: postId });
      deleteFile(post.imageUrl);

      const user = await User.findById({ _id: req.userId });
      user.posts.pull(postId); // remove the post from the user's posted post's array
      await user.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
    return "Post delted successfully !";
  },

  user: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 422;
      throw error;
    }
    try {
      const user = await User.findOne({ _id: req.userId });

      if (!user) {
        const error = new Error("User not found!");
        error.code = 404; // not found
        throw error;
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }

    return { ...user._doc, _id: user._id.toString() };
  },

  updateUserStatus: async function ({ status }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 422;
      throw error;
    }

    try {
      const user = await User.findById(req.userId);

      user.status = status;

      await user.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    }
    return { ...user._doc, _id: user._id.toString() };
  },
};
const deleteFile = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fileSystem.unlink(filePath, (err) => console.log(err));
};
