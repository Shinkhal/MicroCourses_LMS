import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* --------------------------------
   @desc    Verify JWT & attach user to req
   @usage   protect (middleware)
-------------------------------- */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: {
          code: "NO_TOKEN",
          message: "Authorization token missing or malformed",
        },
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        error: { code: "USER_NOT_FOUND", message: "User not found" },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: "INVALID_TOKEN",
        message: "Token is invalid or expired",
        details: error.message,
      },
    });
  }
};

/* --------------------------------
   @desc    Restrict access by role
   @usage   authorize("admin"), authorize("creator", "admin")
-------------------------------- */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "User not authenticated" },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: `Access denied: requires one of [${allowedRoles.join(", ")}]`,
        },
      });
    }

    next();
  };
};

/* --------------------------------
   @desc    Restrict to approved creators
   @usage   requireApprovedCreator middleware
-------------------------------- */
export const requireApprovedCreator = (req, res, next) => {
  if (req.user.role !== "creator" || req.user.creatorStatus !== "approved") {
    return res.status(403).json({
      error: {
        code: "NOT_APPROVED_CREATOR",
        message: "You must be an approved creator to access this resource",
      },
    });
  }

  next();
};
