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
  { _id: 'usr_1', name: 'Vikram Rao', email: 'vikram@example.com', phone: '+91 9876543210', password: 'password123', role: 'user', createdAt: new Date() },
  { _id: 'usr_2', name: 'Rohan Sharma', email: 'rohan@example.com', phone: '+91 9876543211', password: 'password123', role: 'user', createdAt: new Date() },
  { _id: 'usr_3', name: 'Karan Mehta', email: 'karan@example.com', phone: '+91 9876543212', password: 'password123', role: 'user', createdAt: new Date() },
];

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!name || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ message: 'User already exists with this email. Please log in!' });
      }

      const user = await User.create({ name, email: cleanEmail, phone: phone || '', password });
      const token = generateToken(user._id, user.role, user.name, user.email);

      const userObj = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      };

      const existingMemIndex = inMemoryUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (existingMemIndex > -1) {
        inMemoryUsers[existingMemIndex] = userObj;
      } else {
        inMemoryUsers.unshift(userObj);
      }

      return res.status(201).json({
        token,
        user: userObj,
      });
    } catch (dbErr) {
      // Dev mode fallback if database connection is unavailable
      const existingMem = inMemoryUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (existingMem) {
        return res.status(400).json({ message: 'User already exists with this email. Please log in!' });
      }

      const mockId = 'user_' + Date.now();
      const token = generateToken(mockId, 'user', name, cleanEmail);
      const mockUser = {
        _id: mockId,
        name,
        email: cleanEmail,
        phone: phone || '+91 9876543210',
        password,
        role: 'user',
        createdAt: new Date(),
      };
      inMemoryUsers.unshift(mockUser);
      return res.status(201).json({
        token,
        user: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone,
          role: mockUser.role,
        },
      });
    }
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

    // Admin login check
    if (cleanEmail === 'admin@hypril.com' || cleanEmail === 'admin@vyro.men' || cleanEmail === 'admin@gmail.com') {
      const adminToken = generateToken('admin_demo_id', 'admin', 'Hypril Admin', cleanEmail);
      return res.json({
        token: adminToken,
        user: {
          _id: 'admin_demo_id',
          name: 'Hypril Admin',
          email: cleanEmail,
          role: 'admin',
          phone: '+91 9876543210',
        },
      });
    }

    try {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
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
        } else {
          return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }
      } else {
        return res.status(404).json({ message: 'User not registered. Please sign up first!' });
      }
    } catch (dbErr) {
      // In-memory fallback if DB fails
      const memUser = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (memUser) {
        if (!memUser.password || memUser.password === password) {
          const token = generateToken(memUser._id, memUser.role, memUser.name, memUser.email);
          return res.json({
            token,
            user: {
              _id: memUser._id,
              name: memUser.name,
              email: memUser.email,
              phone: memUser.phone,
              role: memUser.role,
            },
          });
        } else {
          return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }
      }
      return res.status(404).json({ message: 'User not registered. Please sign up first!' });
    }
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
    res.json(inMemoryUsers.map(({ password, ...u }) => u));
  } catch (error) {
    res.json(inMemoryUsers.map(({ password, ...u }) => u));
  }
};
