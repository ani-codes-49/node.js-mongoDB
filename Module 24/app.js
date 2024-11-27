const express = require("express");

const path = require('path');

const feedRouter = require("./routes/feed");

const authRouter = require('./routes/auth');

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const multer = require("multer");

const { v4: uuidV4} = require('uuid');

const app = express();

const fileStorage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidV4())
  } 
});

const filter = (req, file, cb) => {
  console.log(file);
  if(
    file.mimeType === 'image/png' ||
    file.mimeType === 'image/jpg' ||
    file.mimeType === 'image/jpeg'
  ) {
    cb(null, true); // user's selected file satisfies the condition so return true
  } else cb(null, false); // false otherwise
};

app.use(bodyParser.json());
// app.use(multer({storage: fileStorage, fileStorage: fileStorage}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

//For solving CORS errors (Cross origin resource sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Which domains can access our server
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); //Which methods can server accept
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //Which headers can client set while sending request to our server
  next();
});

app.use("/feed", feedRouter);
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  return res.status(status).json({
    message: message
  });
}); 

mongoose.connect(
  "mongodb+srv://aniruddhkarekar1:hHFdkybiuBDtiJBM@cluster0.2bhulxe.mongodb.net/Rest-Apis"
).then(res => {
    console.log('connected through mongoose');
    const server = app.listen(8080);
    const io = require('./socket')(server);
    io.on('connection', socket => {
      console.log('Socket client connected');
    })
}).catch(err => {
    console.log(err);
});

