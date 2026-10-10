import { Product } from '../models/Product.js';
import { getStore, saveStore } from '../config/store.js';

export const getProducts = async (req, res) => {
  try {
    try {
      const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
      if (products && products.length > 0) return res.json(products);
    } catch (e) {}

    const store = getStore();
    return res.json(store.products.filter((p) => p.isActive !== false));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    try {
      const product = await Product.findOne({ $or: [{ slug: slug }, { _id: slug }] });
      if (product) return res.json(product);
    } catch (e) {}

    const store = getStore();
    const match = store.products.find((p) => p.slug === slug || p._id === slug || p.id === slug);
    if (match) return res.json(match);

    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    return res.status(404).json({ message: 'Product not found' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    try {
      const product = new Product(req.body);
      const saved = await product.save();
      return res.status(201).json(saved);
    } catch (dbErr) {
      const store = getStore();
      const pId = 'prod_' + Date.now();
      const newProd = {
        _id: pId,
        id: pId,
        ...req.body,
        slug: req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: category || 'General',
        price: Number(price),
        comparePrice: Number(req.body.comparePrice || price * 1.4),
        stock: Number(req.body.stock || 50),
        rating: Number(req.body.rating || 5.0),
        reviewCount: Number(req.body.reviewCount || 0),
        images: req.body.images || [req.body.image || ''],
        image: req.body.image || '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      store.products.unshift(newProd);
      saveStore(store);
      return res.status(201).json(newProd);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const store = getStore();
    const idx = store.products.findIndex((p) => p._id === id || p.id === id || p.slug === id);
    if (idx > -1) {
      store.products[idx] = { ...store.products[idx], ...req.body };
      saveStore(store);
      return res.json(store.products[idx]);
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      await Product.findByIdAndDelete(id);
    } catch (dbErr) {}

    const store = getStore();
    store.products = store.products.filter((p) => p._id !== id && p.id !== id && p.slug !== id);
    saveStore(store);

    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
