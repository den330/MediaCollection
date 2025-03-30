require("dotenv").config();
const fs = require('fs');
const path = require('path');
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '..', 'logs', 'access.log'),
    { flags: 'a' }
  );
const http  = require("http");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);
app.use(morgan('combined', { stream: accessLogStream }));

mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/media-collection?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
)

const db = mongoose.connection;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello2 World!");
});

db.once("open", () => {
  server.listen(4000);
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});