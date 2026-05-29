const JWT = require("jsonwebtoken");
const userModels = require("../models/userModel");
const Users = require("../models/user");

//Middleware for protected Routes

const requiredSignIn = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Authorization required",
      });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    console.log("User:", req.user);

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Invalid Token",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);

    console.log("User:", user);
    

    if (user.role !== "Admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {requiredSignIn,  isAdmin};
