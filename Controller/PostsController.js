const expressAsyncHandler = require('express-async-handler');

const Posts = require("../model/postsModel")
const User = require('./../model/userModel');
const multer = require("multer")
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const SECRATE_KEY = process.env.SECRATE_KEY
const jwt = require("jsonwebtoken");
// const { ObjectID } = require('mongoose');




//   this gets all the posts.

const getPosts = expressAsyncHandler(async (req, res) => {
  try {
    if (req.headers.authorization) {
      let readData = await Posts.find();
      res.json(readData);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Cannot read data' });
  }
});

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

//    this is multer code.



const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'InstaClone Images',
  },
});
const upload =  multer({
  storage:storage
})
const middleware = upload.single("file");

//   this creates new post .

const createNewPost = expressAsyncHandler(async (req, res) => {
 
  try {    
    const ReqUser = await User.findById(req.body.userID.slice(1, req.body.userID.length - 1));
    
    if (!ReqUser) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const newPost = new Posts({
        file: {
          url: req.file.path,
          imageId: `${Date.now()}/${req.file.filename}`,
        },
        userId: ReqUser._id,
        author: ReqUser.Name,
        location: req.body.location,
        description: req.body.description,
        date: new Date().toLocaleDateString(),
        likes: []
      });
  
      const createdPost = await newPost.save();

      // Include the userId in the response
      res.status(201).json({ ...createdPost.toObject(), userId: ReqUser._id });
    }
  } catch (error) {
    res.status(400).json({ message: 'Post is not created' });
  }
});




//   Like a perticular post.


const LikeAPost = expressAsyncHandler(async (req, res) => {
  
  try {
    const key = req.params.id;
    const userId = req.body.userId;
    // Extract the postId from the key
   // Modify this line based on how you structure the postId in the key
    const post = await Posts.findById(key);
    console.log(post);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.likes.includes(userId)) {
      // User has already liked the post, so remove the like
      post.likes.pull(userId);
    } else {
      // User has not liked the post, so include the like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



const commentAPost = expressAsyncHandler(async (req, res) => {
 
  try {
    const postId = req.params.id;

    const post = await Posts.findById(postId);  // returning post 
    
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
   
  
    const users = await User.findById(req.body.userId.slice(1, req.body.userId.length-1));

        
        const commet = {
          name: users.Name,
          comment: req.body.text,
          profile: users.file.url,
          userId: users._id  
        };
       
        post.comment.push(commet)
        const updatedPost = await post.save();
        res.status(200).json( updatedPost );
      }catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})



const getAPost = expressAsyncHandler(async (req, res) => {
  
  try {
    const postId = req.params.id;

    const post = await Posts.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

 
    res.json(post.comment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})

const getPostsOfUser = expressAsyncHandler(async (req, res) => {
 
  try {
    let userId = req.params.id;
    if (req.headers.authorization) {
      let readData = await Posts.find();
      let filteredArray = await readData.filter((element) => element.userId == userId);
      res.json(filteredArray);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Cannot read data' });
  }
});





module.exports = {
    getPosts,
    middleware,
    createNewPost,
    LikeAPost,
    commentAPost,
    getAPost,
    getPostsOfUser
  };