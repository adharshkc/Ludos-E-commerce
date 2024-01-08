const checkAuth = (req, res, next) => {
  if (req.session.user) {
    console.log("authenticated")
    next();
  } else {
    // res.status(401).json({ success: false, message: 'Unauthorized access' });
    console.log("not authenticated")
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
