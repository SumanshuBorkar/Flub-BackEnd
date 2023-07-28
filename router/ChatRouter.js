const express =require("express");
const Router = express.Router();
const {accessChat, fetchChat, createGroup, renameGroup, removeFromGroup, addToGroup} = require("./../Controller/ChatController")
const authMiddleware = require("./../AuthMiddleware");

Router
  .route('/')
  .get( authMiddleware, fetchChat)
  .post( authMiddleware, accessChat)

Router
   .route('/group')
   .post(authMiddleware, createGroup)

Router
   .route('/rename')
   .put(authMiddleware, renameGroup)
   
Router
   .route('/groupremove')
   .put(authMiddleware, removeFromGroup);

Router
   .route('/groupadd')
   .put(authMiddleware, addToGroup)

module.exports = Router;