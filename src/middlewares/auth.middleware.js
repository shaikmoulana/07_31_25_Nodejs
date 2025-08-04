const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("Token is required");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).send("Invalid Token");

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).send("Access denied");
      }

      req.user = decoded;
      next();
    });
  };
};
