const express = require('express');
const userRouter = express.Router();

const { getUser, postUser } = require('../controller/userController');

userRouter.get("/users", getUser);
userRouter.post("/users", postUser);



module.exports = userRouter;