const express =require("express");
const Router = express.Router();
const {userRegisterCtrl, middleware, loginUserCtrl, allUsers, getPerticularUser, FollowUser, EditUser} = require("./../Controller/UserController");
const Authorisation = require("./../AuthMiddleware")
const cors = require("cors");


Router
  .route('/signup')
  .post(middleware, userRegisterCtrl)

Router
   .route('/login')
   .post(cors(), loginUserCtrl) 

Router
   .route('/users')
   .get(Authorisation ,allUsers)

Router
   .route('/gUser/:id')
   .get(getPerticularUser)
   .put(FollowUser)

Router
   .route('/Edit')
   .put(middleware, EditUser)


module.exports = Router;




