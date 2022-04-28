const jwt = require('jsonwebtoken');
const config = require('../config');


const privateKey = Buffer.from(config.server.AUTH_PRIVATE_KEY, 'base64');

const generateAccessToken = (user) => {
  const signValue = {
    user
  }

  const expiresIn = '5m';

  return jwt.sign(signValue, privateKey, {
    expiresIn,
    algorithm: 'RS256'
  });
}

const verifyToken = token => {
  return jwt.verify(token, privateKey, { algorithms: 'RS256' });
}

module.exports = {
  generateAccessToken,
  verifyToken
}