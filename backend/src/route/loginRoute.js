const loginController = require("../controller/loginController");
const express = require("express");
const loginRoute = express.Router();

loginRoute.post("/", loginController);

module.exports = loginRoute;