const expressAsyncHandler = require( 'express-async-handler' );
const User = require( './../model/userModel' );
require( "dotenv" ).config();
const SECRATE_KEY = process.env.SECRATE_KEY;
const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
const multer = require("multer")
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

//    this is multer code.


const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'InstaClone Dp',
  },
});

const upload =  multer({
  storage:storage
})
const middleware = upload.single("file");


const userRegisterCtrl = expressAsyncHandler( async ( req, res ) => {
  
  try
  {
    let  password = req.body.password[0];
    let  email = req.body.email[0];
    let name = req.body.Name[0];
    let hashedPassword = await bcrypt.hash( password, 10 );

    let user = await User.findOne( { email } );
    
    if ( user ) return res.status( 400 ).json( { status: "Failed", field: "email", message: "Email already exist!!" } )
    let newUser = await new User( {
      file: {
        url: req.file.path,
        imageId: `${Date.now()}/${req.file.filename}`,
      },
      password: hashedPassword,
      email: email,
      Name: name ,
      Followers: [],
      Following: []  
    } );
    newUser = await newUser.save();
    
    res.status( 201 ).json( { status: "Success", user: newUser } );
  } catch ( err )
  {
    res.status( 400 ).json( { status: "Failed", message: err.message } );
  }

} )

const loginUserCtrl = expressAsyncHandler( async ( req, res ) => {
  
  try
  {
    let user = await User.findOne( { email: req.body.email } );
    if ( user )
    {
      let matchPass = await bcrypt.compare( req.body.password, user.password );
      if ( matchPass )
      {
        const token = await jwt.sign( { _id: user._id }, SECRATE_KEY );
        res.setHeader('Authorization', `Bearer ${token}`).send( {
          status: 'Successfully login',
          name: user.Name,
          userId: user._id,
          token: token,
          user: user
        } );
      } else {
  res.status( 401 ).send( { status: 'fail', message: 'User Details Not Match' } );
}
    } else {
  res.status( 401 ).send( { status: 'fail', message: 'User Details Not Match' } );
}
  } catch ( err )
{
  res.status( 400 ).send( err.message );
}
});


const allUsers = expressAsyncHandler( async (req, res) => {
  try{
    const keyword = req.query.search ? 
    {
      $or: [
        {name: {$regex: req.query.search, $options: "i"}},
        {email: {$regex: req.query.search, $options: "i"}},
      ]
    } : {};
  
    const users = await User.find(keyword).find({_id:{$ne: req.user._id}});
  
    res.status(200).send(users);
  }catch(err){
 
  }
})

const getPerticularUser = expressAsyncHandler( async (req, res) => {
  
  try {
    const UserId = req.params.id;

    const Usermd = await User.findById(UserId);
    
    if (!Usermd) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
                     
    res.json(Usermd);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})
                                    
const FollowUser = expressAsyncHandler(async (req, res) => {
 
  try {
    const key = req.params.id;
    const userId = req.body.id;
    // Extract the postId from the key
   // Modify this line based on how you structure the postId in the key
    const Dusra = await User.findById(key);
    const khud = await User.findById(userId);
   
    if (!Dusra || !khud) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (Dusra.Followers.includes(userId)) {
      // User has already liked the post, so remove the like
      Dusra.Followers.pull(userId);
      khud.Following.pull(key);
    } else {
      // User has not liked the post, so include the like
      Dusra.Followers.push(userId);
      khud.Following.push(key);
    }

    await Dusra.save();
    await khud.save();

    res.status(200).json(Dusra);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const EditUser = expressAsyncHandler(async (req, res) => {
  try {

    const userId = req.body.userId;
    const bio = req.body.Bio;
    const file = req.file;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (bio) {
      user.Bio = bio;
    }

    if (file) {
      
      user.file = {
        url: req.file.path,
        imageId: `${Date.now()}/${req.file.filename}`,
      }
    }

    await user.save();

    res.status( 200 ).json(user);
  } catch (error) {
    res.status( 400 ).json( { status: "Failed", message: error.message } );
  }

});

module.exports = { userRegisterCtrl, loginUserCtrl, middleware, allUsers, getPerticularUser, FollowUser, EditUser};