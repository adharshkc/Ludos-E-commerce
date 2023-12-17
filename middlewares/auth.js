const checkAuth = (req, res, next) => {
    if (req.session && req.session.authenticated) {
      return next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
  };
  
  module.exports = {
    checkAuth
  };