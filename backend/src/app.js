require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const http  = require("http");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

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
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db.once("open", () => {
  server.listen(4000);
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});