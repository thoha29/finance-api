const { tokenVerifier } = require('../helpers/jsonwebtoken');

const authentication = (req, res, next) => {
  const access_token = req.headers.access_token;

  if (access_token) {
    try {
      let verifyToken = tokenVerifier(access_token);
      req.userData = verifyToken;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token not authenticated' });
    }
  } else {
    res.status(404).json({ message: 'Token not found' });
  }
};

module.exports = {
  authentication,
};
