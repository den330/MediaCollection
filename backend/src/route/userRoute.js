const userController = require('../controller/userController');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/addBook', userController.addBook);
userRouter.post('/addMusic', userController.addMusic);
userRouter.post('/removeMusic', userController.removeMusic);
userRouter.post('/removeBook', userController.removeBook);

module.exports = userRouter;