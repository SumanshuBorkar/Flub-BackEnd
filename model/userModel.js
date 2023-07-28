const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // for hashing password

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'you have to register email']
    },
    password: {
        type: String,
        required: [true, 'you have to register password']
    },
    file:{
        type:Object,
        require:true
    },
    Followers: {
        type: [String], // Assuming the likes are stored as user IDs
        default: []
    },
    Following: {
        type: [String], // Assuming the likes are stored as user IDs
        default: []
    },
    Bio: {
        type: String,
        default: "Hey, I am new on FLUB ✅"
    },
    accountVerificationToken : String,
    accountVerificationExpires : Date,
    accountVerificationTokenExpires : Date,
    passwordChangedAt: Date,
    passwordRestToken: String,
    passwordResetExpires: Date,
},
{
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    },
    timestamps: true
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;

