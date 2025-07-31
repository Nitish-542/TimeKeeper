import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded._id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  } else {
    req.user = null;
    next();
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    
    if (req.user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }
    next(); 
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: "Unauthorized access",
      error,
    });
  }
};
