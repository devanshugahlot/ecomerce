import { Category } from '../models/Category.js';
import { getStore, saveStore } from '../config/store.js';

export const getCategories = async (req, res) => {
  try {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      if (categories && categories.length > 0) return res.json(categories);
    } catch (e) {}

    const store = getStore();
    return res.json(store.categories);
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

    try {
      const cat = new Category(req.body);
      const saved = await cat.save();
      return res.status(201).json(saved);
    } catch (dbErr) {
      const store = getStore();
      const catId = 'cat_' + Date.now();
      const newCat = {
        _id: catId,
        id: catId,
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        badge: req.body.badge || 'NEW',
        image: req.body.image || '',
        ...req.body,
        createdAt: new Date().toISOString(),
      };
      store.categories.unshift(newCat);
      saveStore(store);
      return res.status(201).json(newCat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const store = getStore();
    const idx = store.categories.findIndex((c) => c._id === id || c.id === id || c.slug === id);
    if (idx > -1) {
      store.categories[idx] = { ...store.categories[idx], ...req.body };
      saveStore(store);
      return res.json(store.categories[idx]);
    }
    res.status(404).json({ message: 'Category not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      await Category.findByIdAndDelete(id);
    } catch (dbErr) {}

    const store = getStore();
    store.categories = store.categories.filter((c) => c._id !== id && c.id !== id && c.slug !== id);
    saveStore(store);

    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
