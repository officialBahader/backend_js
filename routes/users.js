var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Token verification middleware
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }
// console.log(token);
//   jwt.verify(token, "1234567890", (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }

//     req.userId = decoded.userId;
//     next();
//   });
// }
function verifyToken(req, res, next) {
  
  if (req.headers['authorization']) {
      try {
          let authorization = req.headers['authorization'].split(' ');
          console.log(authorization[1]);
          if (authorization[0] !== 'Bearer') {
              return res.status(401).send('invalid request'); //invalid request
          } else {
              jwt.verify(authorization[1], "1234567890", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
          }
      } catch (err) {
        return res.status(403).send({
          message:'invalid request'
        });}
  } else {
      return res.status(401).send({
        message:'invalid request'
      });
  }
}
// GET user profile based on token (requires authentication)
router.post('/profile', verifyToken, async function(req, res, next) {
  try {
    const newUser = await User.findById(req.userId);
    res.json({ user: newUser });
  } catch (error) {
    next(error);
  }
});

// GET all users
router.post('/all', async function(req, res, next) {
  try {
    const users = await User.find();
    res.json({users:users});
  } catch (error) {
    next(error);
  }
});

// POST create a new userconst bcrypt = require('bcrypt');
const saltRounds = 10; 
router.post('/register', async function(req, res, next) {
  try {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(req.body.password,
       saltRounds);

    // Create a new user with the hashed password
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age, 
    });

    const token = jwt.sign({ userId: newUser._id },
       '1234567890');

    res.json({ user: newUser, accessToken:token }); 
   } catch (error) {
    next(error);
  }
});


// POST login (without JWT token)
router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user is not found
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the password does not match
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Password matches, create an access token
    const accessToken = jwt.sign({ userId: user._id }, "1234567890"); 

    // You can send the access token in the response or handle it as needed
    res.json({user:user, accessToken:accessToken });
  } catch (error) {
    next(error);
  }
});


// PUT update a user profile by ID
router.post('/updateProfile', verifyToken, async function(req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json({user:updatedUser});
  } catch (error) {
    next(error);
  }
});

// DELETE user account by ID
router.post('/deleteAccount', verifyToken, async function(req, res, next) {
  try {
    const updatedUser = await User.findByIdAndDelete(req.userId);
    res.json({user:updatedUser,
       message: 'User account deleted successfully',
       });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
