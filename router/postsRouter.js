const express =require("express");
const Router = express.Router();
const {getPosts, middleware, createNewPost, LikeAPost, commentAPost,getAPost, getPostsOfUser} = require("../Controller/PostsController")
const authMiddleware = require("./../AuthMiddleware");

Router
  .route('/post')
  .get( getPosts)
  .post( middleware ,createNewPost)
  

Router
   .route('/post/:id')
   .put(commentAPost)
   .get(getAPost)

Router
   .route('/post/like/:id')
   .put(LikeAPost)

Router
   .route('/post/userposts/:id')
   .get(getPostsOfUser);
 
   

module.exports = Router;