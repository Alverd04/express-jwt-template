import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import nodemailer from "nodemailer";

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password_hash: hashedPassword, email });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.code === 11000) {
      if (error.keyValue.email)
        return res.status(400).json({ error: "Email already exists" });
      if (error.keyValue.username)
        return res.status(400).json({ error: "Username already exists" });
      else return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user =
      (await User.findOne({ email }).select("+password_hash")) ||
      (await User.findOne({ username: email }).select("+password_hash"));

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      expiresIn: 3600,
      userId: user._id,
      refreshToken,
      hasProfile: user.hasProfile,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Route to initiate password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  // Check if the email exists in your user database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Email not found" });
  }

  // Generate a password reset token
  const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
  const token = jwt.sign({ userId: user._id }, secretKey, {
    expiresIn: "1h",
  });

  // Save the token in the user's document
  user.reset_password_token = token;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "albert.font.fernandez@gmail.com",
      pass: "ipvl vgnq gxon tqxl",
    },
  });

  const mailOptions = {
    from: "alverdphotos@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log(`Email sent: ${info.response}`);
      res
        .status(200)
        .send("Check your email for instructions on resetting your password");
    }
  });
});

// Route to refresh the access token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

  const refreshTokenValue = refreshToken.split(" ")[1];

  jwt.verify(refreshTokenValue, secretKey, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    const token = jwt.sign({ userId: user.userId }, secretKey, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user.userId }, secretKey, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ token, expiresIn: 3600, userId: user.userId, refreshToken });
  });
});

export default router;
