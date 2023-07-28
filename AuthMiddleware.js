// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('./model/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the token and extract the user ID
    const { _id } = jwt.verify(token, process.env.SECRATE_KEY);

    // Check if the user exists
    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
