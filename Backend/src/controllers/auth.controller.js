const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailService = require("../services/email.service");
const config = require("../config/config");
const sessionModel = require("../models/session.model");
const otpModel = require("../models/otp.model");
const { generateOTP, getOTPhtml } = require("../utils/utils");

async function registerUser(req, res) {
  const data = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email: data.email }, { name: data.name }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User with this email or name already exists",
    });
  }

  const user = await userModel.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  });

  // const refreshToken = jwt.sign(
  //   { id: user._id, role: user.role },
  //   config.JWT_SECRET,
  //   { expiresIn: "7d" },
  // );

  // const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  // const session = await sessionModel.create({
  //   userId: user._id,
  //   refreshTokenHash,
  //   ip: req.ip,
  //   userAgent: req.headers["user-agent"],
  // });

  // console.log("Session created:", session);

  // const accessToken = jwt.sign(
  //   { id: user._id, role: user.role, sessionId: session._id },
  //   config.JWT_SECRET,
  //   {
  //     expiresIn: "15m",
  //   },
  // );

  // res.cookie("refreshtoken", refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "strict",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });
  const otp = generateOTP();
  // const otpHtml = getOTPhtml(otp);

  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
  await otpModel.create({
    email: user.email,
    otphash: otpHash,
    expiresAt,
  });

  await emailService.sendOTPEmail(user.email, otp);

  res.status(201).json({
    message: "User created successfully",
    user: {
      name: user.name,
      email: user.email,
      password: user.password,
      verified: user.verified,
    },
    // accessToken,
  });
}

const loginUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  if (!user.verified) {
    return res.status(403).json({
      message: "Account not verified. Please check your email for the OTP.",
    });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  const session = await sessionModel.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    { id: user._id, role: user.role, sessionId: session._id },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: "Login successful",
    user,
    accessToken,
  });
};

// const adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email }).select("+password");

//   if (!user || user.role !== "admin") {
//     return res.status(401).json({
//       message: "Invalid credentials",
//     });
//   }

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     return res.status(401).json({
//       message: "Invalid credentials",
//     });
//   }

//   const refreshToken = jwt.sign(
//     { id: user._id, role: user.role },
//     config.JWT_SECRET,
//     { expiresIn: "7d" },
//   );

//   const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

//   const session = await sessionModel.create({
//     userId: user._id,
//     refreshTokenHash,
//     ip: req.ip,
//     userAgent: req.headers["user-agent"],
//   });

//   const accessToken = jwt.sign(
//     { id: user._id, role: user.role, sessionId: session._id },
//     config.JWT_SECRET,
//     { expiresIn: "15m" },
//   );

//   res.cookie("refreshtoken", refreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });

//   res.status(200).json({
//     message: "Admin login successful",
//     user,
//     accessToken,
//   });
// };

const getMe = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      user,
    });
  });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(refreshToken, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const refreshTokenHash = bcrypt.hashSync(refreshToken, 10);

    const session = sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      config.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const newRefreshTokenHash = bcrypt.hashSync(newRefreshToken, 10);

    session.refreshTokenHash = newRefreshTokenHash;
    session.save();
    res.cookie("refreshtoken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken,
    });
  });
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token not found",
    });
  }

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(400).json({
      message: "Invalid refresh token",
    });
  }

  session.revoked = true;
  await session.save();

  res.clearCookie("refreshtoken");

  res.status(200).json({
    message: "Logout successful",
  });
};

const logoutAll = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token not found",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  await sessionModel.updateMany(
    { userId: decoded.id, revoked: false },
    { revoked: true },
  );

  res.clearCookie("refreshtoken");

  res.status(200).json({
    message: "All sessions logged out successfully",
  });
};

const verifyEmail = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const otp = req.body.otp?.trim();

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      message: "Email is already verified",
    });
  }

  const otpRecord = await otpModel.findOne({ email });

  if (!otpRecord) {
    return res.status(400).json({
      message: "OTP not found for this email",
    });
  }

  if (otpRecord.expiresAt < new Date()) {
    return res.status(400).json({
      message: "OTP has expired",
    });
  }

  const isMatch = await bcrypt.compare(otp, otpRecord.otphash);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  await userModel.findOneAndUpdate({ email }, { verified: true });
  await otpModel.deleteOne({ email });
  await emailService.sendRegistrationEmail(user.email, user.name);

  res.status(200).json({
    message: "Email verified successfully",
  });
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  if (user.verified) {
    return res.status(400).json({
      message: "Email is already verified",
    });
  }
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
  await otpModel.findOneAndUpdate(
    { email },
    { otphash: otpHash, expiresAt },
    { upsert: true },
  );
  await emailService.sendOTPEmail(user.email, otp);

  res.status(200).json({
    message: "OTP resent successfully",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logout,
  logoutAll,
  verifyEmail,
  resendOTP,
};
