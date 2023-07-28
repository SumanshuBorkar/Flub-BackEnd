const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    file:{
        type:Object,
        require:true
    },
    author:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true   
    },
    description:{
        type:String,
        require:true   
    },
    date:{
        type:String,
        default:(new Date().toLocaleDateString())
    },
    likes: {
        type: [String], // Assuming the likes are stored as user IDs
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Change the type to ObjectId
        ref: 'User', // Assuming the model for user is named 'User'
        required: true
      },
    userDp:{
        type:Object
    },
    comment:{
        type:[Object],
        default: []
    }
})

const Posts = new mongoose.model("Post" , PostSchema)
module.exports = Posts;