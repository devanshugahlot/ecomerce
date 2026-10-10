import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id, role, name, email) => {
  return jwt.sign(
    { id: id.toString(), role, name, email },
    process.env.JWT_SECRET || 'hypril_super_secret_jwt_key_2026_mens_wellness',
    { expiresIn: '30d' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!name || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email. Please log in!' });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '',
      password,
    });

    const token = generateToken(user._id, user.role, user.name, user.email);

    return res.status(201).json({
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not registered. Please sign up first!' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken(user._id, user.role, user.name, user.email);
    return res.json({
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Login failed' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (user) {
      return res.json({
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    return res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
