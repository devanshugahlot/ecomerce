import { Category } from '../models/Category.js';

let IN_MEMORY_CATEGORIES = [];

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    if (categories && categories.length > 0) {
      return res.json(categories);
    }
    return res.json(IN_MEMORY_CATEGORIES);
  } catch (error) {
    return res.json(IN_MEMORY_CATEGORIES);
  }
};

export const createCategory = async (req, res) => {
  try {
    try {
      const cat = new Category(req.body);
      const saved = await cat.save();
      return res.status(201).json(saved);
    } catch (dbErr) {
      const newCat = {
        _id: 'cat_' + Date.now(),
        id: 'cat_' + Date.now(),
        name: req.body.name,
        slug: (req.body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        badge: req.body.badge || 'NEW',
        image: req.body.image || '',
        ...req.body,
      };
      IN_MEMORY_CATEGORIES.unshift(newCat);
      return res.status(201).json(newCat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    try {
      const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const idx = IN_MEMORY_CATEGORIES.findIndex((c) => c._id === req.params.id || c.id === req.params.id);
    if (idx > -1) {
      IN_MEMORY_CATEGORIES[idx] = { ...IN_MEMORY_CATEGORIES[idx], ...req.body };
      return res.json(IN_MEMORY_CATEGORIES[idx]);
    }
    res.status(404).json({ message: 'Category not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    try {
      await Category.findByIdAndDelete(req.params.id);
    } catch (dbErr) {}
    IN_MEMORY_CATEGORIES = IN_MEMORY_CATEGORIES.filter((c) => c._id !== req.params.id && c.id !== req.params.id);
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
