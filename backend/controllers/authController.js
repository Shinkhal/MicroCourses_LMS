import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* --------------------------------
   Helper: Generate JWT Token
-------------------------------- */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* --------------------------------
   @desc    Register new user
   @route   POST /api/auth/register
   @access  Public
-------------------------------- */
export const registerUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: "name/email/password",
          message: "All fields are required",
        },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        error: {
          code: "EMAIL_EXISTS",
          field: "email",
          message: "Email already registered",
        },
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || "learner",
    });

    const responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      creatorStatus: user.creatorStatus,
      token: generateToken(user._id, user.role),
    };
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        field: null,
        message: error.message,
      },
    });
  }
};

/* --------------------------------
   @desc    Login user
   @route   POST /api/auth/login
   @access  Public
-------------------------------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: "email/password",
          message: "Email and password required",
        },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          field: null,
          message: "Invalid email or password",
        },
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      creatorStatus: user.creatorStatus,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        field: null,
        message: error.message,
      },
    });
  }
};

/* --------------------------------
   @desc    Get logged-in user profile
   @route   GET /api/auth/profile
   @access  Private
-------------------------------- */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          field: null,
          message: "User not found",
        },
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      creatorStatus: user.creatorStatus,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        field: null,
        message: error.message,
      },
    });
  }
};
