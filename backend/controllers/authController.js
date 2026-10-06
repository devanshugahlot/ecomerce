import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id, role, name, email) => {
  return jwt.sign(
    { id, role, name, email },
    process.env.JWT_SECRET || 'vyro_super_secret_jwt_key_2026_mens_wellness',
    { expiresIn: '30d' }
  );
};

let inMemoryUsers = [
  { _id: 'usr_1', name: 'Vikram Rao', email: 'vikram@example.com', phone: '+91 9876543210', role: 'user', createdAt: new Date() },
  { _id: 'usr_2', name: 'Rohan Sharma', email: 'rohan@example.com', phone: '+91 9876543211', role: 'user', createdAt: new Date() },
  { _id: 'usr_3', name: 'Karan Mehta', email: 'karan@example.com', phone: '+91 9876543212', role: 'user', createdAt: new Date() },
];

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({ name, email, phone, password });
      const token = generateToken(user._id, user.role, user.name, user.email);

      inMemoryUsers.unshift({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: new Date(),
      });

      return res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (dbErr) {
      // Dev mode fallback
      const mockId = 'user_' + Date.now();
      const token = generateToken(mockId, 'user', name, email);
      const mockUser = {
        _id: mockId,
        name,
        email,
        phone: phone || '+91 9876543210',
        role: 'user',
        createdAt: new Date(),
      };
      inMemoryUsers.unshift(mockUser);
      return res.status(201).json({
        token,
        user: mockUser,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded Admin check
    if (email === 'admin@hypril.com' || email === 'admin@vyro.men' || (email && email.includes('admin'))) {
      const adminToken = generateToken('admin_demo_id', 'admin', 'Hypril Admin', 'admin@hypril.com');
      return res.json({
        token: adminToken,
        user: {
          _id: 'admin_demo_id',
          name: 'Hypril Admin',
          email: 'admin@hypril.com',
          role: 'admin',
          phone: '+91 9876543210',
        },
      });
    }

    try {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role, user.name, user.email);
        return res.json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        });
      }
    } catch (dbErr) {
      // In-memory user fallback
      const token = generateToken('user_demo_id', 'user', 'Customer User', email);
      return res.json({
        token,
        user: {
          _id: 'user_demo_id',
          name: 'Customer User',
          email,
          phone: '+91 9876543210',
          role: 'user',
        },
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Login failed' });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    if (users && users.length > 0) return res.json(users);
    res.json(inMemoryUsers);
  } catch (error) {
    res.json(inMemoryUsers);
  }
};

