const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phoneNumber, password 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashed,
      // role: ['admin', 'user'].includes(role) ? role : 'user',
      passport: req.files?.passport?.[0]?.filename || '',
      idImageFront: req.files?.front?.[0]?.filename || '',
      idImageBack: req.files?.back?.[0]?.filename || '',
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// UPDATE SELF
exports.updateSelf = async (req, res) => {
  try {
    const updates = req.body;

    if (req.files?.front) updates.idImageFront = req.files.front[0].filename;
    if (req.files?.back) updates.idImageBack = req.files.back[0].filename;
    if (req.files?.passport) updates.passport = req.files.passport[0].filename;

    await User.update(updates, { where: { id: req.user.id } });

    const updated = await User.findByPk(req.user.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// GET ALL USERS (admin only)
exports.getAllUsers = async (_, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Fetch users failed', error: err.message });
  }
};

// UPDATE USER BY ADMIN
exports.updateUserById = async (req, res) => {
  try {
    const updates = { ...req.body };

    // If multer uploaded files, assign filenames to updates
    if (req.files?.passport?.[0]) {
      updates.passport = req.files.passport[0].filename;
    }

    if (req.files?.front?.[0]) {
      updates.idImageFront = req.files.front[0].filename;
    }

    if (req.files?.back?.[0]) {
      updates.idImageBack = req.files.back[0].filename;
    }

    // Perform the update
    const [affected] = await User.update(updates, {
      where: { id: req.params.id }
    });

    if (!affected) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    console.error('Admin update error:', err); 
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE USER BY ADMIN
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });

    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// controllers/user.controller.js
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};
