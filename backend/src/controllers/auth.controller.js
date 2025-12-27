import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { AppError, catchAsync } from "../middleware/errorHandler.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  return { accessToken, refreshToken };
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isSecure = process.env.COOKIE_SECURE === "true";
  const sameSite = process.env.COOKIE_SAME_SITE || "lax";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, company, role } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return next(new AppError("User with this email already exists", 400));
  }

  // Only allow USER and TECHNICIAN roles during registration
  // ADMIN and MANAGER roles can only be assigned by admin
  const allowedRoles = ["USER", "TECHNICIAN"];
  const userRole = allowedRoles.includes(role) ? role : "USER";

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      company,
      role: userRole,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: true,
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json({
    status: "success",
    data: { user },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  res.cookie("accessToken", "", { maxAge: 0 });
  res.cookie("refreshToken", "", { maxAge: 0 });

  res.json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
      },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return next(new AppError("Invalid refresh token", 401));
  }
});

export const getMe = catchAsync(async (req, res) => {
  res.json({
    status: "success",
    data: { user: req.user },
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists
    return res.json({
      status: "success",
      message:
        "If an account exists with this email, you will receive a password reset link.",
    });
  }

  // In production, send email with reset link
  // For now, just log to console
  console.log(`Password reset requested for: ${email}`);

  res.json({
    status: "success",
    message:
      "If an account exists with this email, you will receive a password reset link.",
  });
});
