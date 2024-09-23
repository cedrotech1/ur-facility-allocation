import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  generatePasswordResetToken,
  getUserByEmail,
  isTokenValid,
  resetPasswordService,
} from "../services/userService.js";
import Email from "../utils/mailer";

export const login = async (req, res) => {
  if (!req.body.email || req.body.email === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide email",
    });
  }
  if (!req.body.password || req.body.password === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide password",
    });
  }
  let user = await getUserByEmail(req.body.email);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }
  if (user.status !== "active") {
    return res.status(400).json({
      success: false,
      message: "Your account is not active",
    });
  }
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: generateToken(user.id),
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      image: user?.image,
      role: user.role,
      campus: user?.campusInfo,
      college: user.college,
      school: user.school,
      status: user.status,
      privileges: user.privileges ? user.privileges : [],
    },
  });
};

export const forgotPassword = async (req, res) => {
  if (!req.body.email || req.body.email === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide email",
    });
  }
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    });
  }
  const resetToken = await generatePasswordResetToken(user);

  const url = `${process.env.FRONTEND_URL}auth/reset/${resetToken}`;

  await new Email(user, url).sendResetPassword();

  return res.status(200).json({
    success: true,
    message: "Password reset link sent to your email",
  });
};

export const resetPassword = async (req, res) => {
  try {
    if (!req.body.token || req.body.token === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide token",
      });
    }

    if (!req.body.password || req.body.password === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide password",
      });
    }

    if (!req.body.confirmPassword || req.body.confirmPassword === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide confirmPassword",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword does not match",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await isTokenValid(req.body.token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    await resetPasswordService(user, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log("Error in resetPassword:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
