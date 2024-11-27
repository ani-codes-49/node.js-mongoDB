const express = require("express");

// const https = require("https");

const path = require("path");

const fs = require("fs");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const multer = require("multer");

const { v4: uuidV4 } = require("uuid");

const app = express();

const helmet = require("helmet"); // for setting secure headers

const compression = require("compression"); // for compressing the assets

const morgan = require("morgan"); // for setting logs in the server

const auth = require("./middlewares/is-auth");

const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

// const publicKey = fs.readFileSync("key.pem");

// const sslCert = fs.readFileSync("cert.pem");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidV4());
  },
});

const filter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimeType === "image/png" ||
    file.mimeType === "image/jpg" ||
    file.mimeType === "image/jpeg"
  ) {
    cb(null, true); // user's selected file satisfies the condition so return true
  } else cb(null, false); // false otherwise
};

const logFileStream = fs.createWriteStream(path.join(__dirname, "server.log"), {
  flags: "a",
});

app.use(helmet());
app.use(compression());

app.use(morgan("combined", { stream: logFileStream }));

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileStorage: fileStorage }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

//For solving CORS errors (Cross origin resource sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Which domains can access our server
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); //Which methods can server accept
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //Which headers can client set while sending request to our server
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.file) {
    res.status(200).json({
      message: "No file choosen",
    });
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res.status(201).json({
      message: "File Stored",
      filePath: req.file.path,
    });
  }
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.originalError.message || "And error occured";
      const errorCode = err.originalError.code || 500;
      return { message: message, statusCode: errorCode, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  return res.status(status).json({
    message: message,
  });
});

mongoose
  .connect(
    "mongodb+srv://aniruddhkarekar1:hHFdkybiuBDtiJBM@cluster0.2bhulxe.mongodb.net/Rest-Apis"
  )
  .then((res) => {
    console.log("connected through mongoose");

    // https.createServer(
    //   {
    //     key: publicKey,
    //     cert: sslCert,
    //   },
    //   app
    // );

    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

const deleteFile = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fileSystem.unlink(filePath, (err) => console.log(err));
};
