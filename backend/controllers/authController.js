const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Worker = require('../models/Worker');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }

    const allowedRole = ['user', 'worker'].includes(role) ? role : 'user';
    const user = await User.create({ name, email, password, phone, role: allowedRole });

    if (allowedRole === 'worker') {
      await Worker.create({ user: user.id, isApproved: true });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user || !(await User.comparePassword(user, password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, error: 'Account has been deactivated.' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Refresh token required.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired refresh token.' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
