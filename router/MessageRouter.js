const express =require("express");
const Router = express.Router();
const {allMessages, sendMessage} = require("./../Controller/MessageController");
const Authorisation = require("./../AuthMiddleware")

Router
  .route('/')
  .post(Authorisation, sendMessage)

Router
   .route('/:chatId')
   .get(Authorisation ,allMessages)

module.exports = Router;