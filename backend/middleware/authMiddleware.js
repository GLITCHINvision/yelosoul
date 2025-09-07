import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect Middleware (Authenticated Users Only)
export const protect = async (req, res, next) => {
  try {
    let token;

    //  Extract token from Authorization header ("Bearer TOKEN")
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error(" Auth Error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

//  Admin Middleware (For Admin Access Only)
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};





