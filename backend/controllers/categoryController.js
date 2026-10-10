import mongoose from 'mongoose';
import { Category } from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = req.body.slug || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const cat = await Category.create({
      name: name.trim(),
      slug,
      badge: req.body.badge || 'NEW',
      image: req.body.image || '',
      description: req.body.description || '',
    });

    return res.status(201).json(cat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const query = [{ slug: id }];
    if (mongoose.isValidObjectId(id)) {
      query.push({ _id: id });
    }

    const updated = await Category.findOneAndUpdate(
      { $or: query },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const query = [{ slug: id }];
    if (mongoose.isValidObjectId(id)) {
      query.push({ _id: id });
    }

    const deleted = await Category.findOneAndDelete({ $or: query });
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
