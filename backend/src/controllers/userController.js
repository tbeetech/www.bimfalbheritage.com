const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/userAuthMiddleware');

/** Return 503 when the database connection is not yet established. */
const requireDb = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Service temporarily unavailable, please try again later' });
    return true;
  }
  return false;
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

const signToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

const register = async (req, res, next) => {
  if (requireDb(res)) return;
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('name, email and password are required');
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(409);
      throw new Error('An account with this email already exists');
    }

    const user = await User.create({ name: name.trim(), email, password });
    const token = signToken(user);
    res.cookie('bh_token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
};

const userLogin = async (req, res, next) => {
  if (requireDb(res)) return;
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const token = signToken(user);
    res.cookie('bh_token', token, COOKIE_OPTIONS);

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
};

const userLogout = (req, res) => {
  res.clearCookie('bh_token');
  return res.json({ message: 'Logged out' });
};

const getMe = async (req, res, next) => {
  if (requireDb(res)) return;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    return res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, role: user.role });
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  if (requireDb(res)) return;
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (typeof bio === 'string') updates.bio = bio.trim();
    if (typeof avatar === 'string') updates.avatar = avatar.trim();

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    return res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, role: user.role });
  } catch (err) {
    return next(err);
  }
};

const changePassword = async (req, res, next) => {
  if (requireDb(res)) return;
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('currentPassword and newPassword are required');
    }
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters');
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const match = await user.comparePassword(currentPassword);
    if (!match) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, userLogin, userLogout, getMe, updateProfile, changePassword };
