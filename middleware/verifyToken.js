const jwt = require('jsonwebtoken');

// Token verification middleware
const verifyToken = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(401).send({
      message: 'invalid request'
    });
  }
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
      message: 'invalid request'
    });
  }
}

module.exports = verifyToken;