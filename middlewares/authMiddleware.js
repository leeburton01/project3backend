const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token);

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access Denied. Invalid token format." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log("Verified user from token:", req.user);

    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

module.exports = verifyToken;
