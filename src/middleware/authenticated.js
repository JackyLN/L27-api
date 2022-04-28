
import { verifyToken } from '../utils/auth_jwt';

const authenticationError = res => {
  res.status(401).send({
    error_code: 'AUTHENTICATION_ERROR',
    message: 'Please log in'
  });
};

module.exports = (req, res, next) => {
  try {
    // validate token using public key

    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });

    req.user = verifyToken(accessToken,);
    next();
  } catch (error) {
    return res.status(401).send({
      error_code: error.error_code,
      message: error.message
    });
  }
}