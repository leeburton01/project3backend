// middlewares/adminMiddleware.js

module.exports = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next(); // User is admin, allow access to the route
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
