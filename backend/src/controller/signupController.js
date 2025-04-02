const asyncHandler = require("express-async-handler");
const UserModel = require("../model/User");

const signupController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email required");
  }
  await UserModel.insertUser(email);
  res.status(201).json({ message: "User created" });
});

module.exports = signupController;