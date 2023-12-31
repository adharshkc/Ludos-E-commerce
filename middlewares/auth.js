const checkAuth = (req, res, next) => {
  if (req.session.user) {
    // console.log(req.session)
    next();
  } else {
    // res.status(401).json({ success: false, message: 'Unauthorized access' });
    res.redirect("/login");
  }
};
const checkAdmin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = {
  checkAuth,
  checkAdmin,
};
