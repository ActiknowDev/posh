const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "Access Denied: No Token Provided!"
    });
  }

  try {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({
            success: false,
            message: "Token has expired. Please log in again.",
          });
        }

        return res.status(401).send({
          success: false,
          message: "Unauthorized! Invalid token.",
        });
      }

      req.userId = decoded.id;
      next();
    });
      
  } catch (err) {
    res.status(401).send({
      success: false,
      message:"Access Denied: Invalid Token!"
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (!req.userId) {
    return res.status(400).send({
      success: false,
      message: "User ID is not defined. Authentication may have failed.",
    });
  }

  User.findByPk(req.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ success: false, message: "User Not Found." });
      }
      if (user.role === "SuperAdmin") {
        next(); 
      } else {
        res.status(403).send({
          success: false,
          message: "Require SuperAdmin Role!",
        });
      }
    })
    .catch(err => {
      console.error("Database error:", err); 
      res.status(500).send({ success: false, message: err.message });
    });
};

const isAgent = (req, res, next) => {
  if (!req.userId) {
    return res.status(400).send({
      success: false,
      message: "User ID is not defined. Authentication may have failed.",
    });
  }

  User.findByPk(req.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ success: false, message: "User Not Found." });
      }
      if (user.role === "Agent") {
        next(); 
      } else {
        res.status(403).send({
          success: false,
          message: "Require Agent Role!",
        });
      }
    })
    .catch(err => {
      console.error("Database error:", err); 
      res.status(500).send({ success: false, message: err.message });
    });
};

const authJwt = {
  verifyToken: verifyToken,
  isSuperAdmin: isSuperAdmin,
  isAgent: isAgent,
};
module.exports = authJwt;