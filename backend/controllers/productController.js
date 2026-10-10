import { Product } from '../models/Product.js';

const MOCK_PRODUCTS_BACKEND = [];

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.json(MOCK_PRODUCTS_BACKEND);
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) return res.json(product);
    const mockMatch = MOCK_PRODUCTS_BACKEND.find((p) => p.slug === req.params.slug || p._id === req.params.slug);
    if (mockMatch) return res.json(mockMatch);
    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    const mockMatch = MOCK_PRODUCTS_BACKEND.find((p) => p.slug === req.params.slug || p._id === req.params.slug);
    if (mockMatch) return res.json(mockMatch);
    return res.status(404).json({ message: 'Product not found' });
  }
};

export const createProduct = async (req, res) => {
  try {
    try {
      const product = new Product(req.body);
      const saved = await product.save();
      return res.status(201).json(saved);
    } catch (dbErr) {
      const newProd = {
        _id: 'prod_' + Date.now(),
        id: 'prod_' + Date.now(),
        ...req.body,
        rating: req.body.rating || 5.0,
        reviewCount: req.body.reviewCount || 1,
        images: req.body.images || [req.body.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'],
      };
      MOCK_PRODUCTS_BACKEND.unshift(newProd);
      return res.status(201).json(newProd);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    try {
      const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updated) return res.json(updated);
    } catch (dbErr) {
      // In-memory update fallback
    }
    const idx = MOCK_PRODUCTS_BACKEND.findIndex((p) => p._id === req.params.id || p.id === req.params.id);
    if (idx > -1) {
      MOCK_PRODUCTS_BACKEND[idx] = { ...MOCK_PRODUCTS_BACKEND[idx], ...req.body };
      return res.json(MOCK_PRODUCTS_BACKEND[idx]);
    }
    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    try {
      await Product.findByIdAndDelete(req.params.id);
    } catch (dbErr) {
      const idx = MOCK_PRODUCTS_BACKEND.findIndex((p) => p._id === req.params.id || p.id === req.params.id);
      if (idx > -1) {
        MOCK_PRODUCTS_BACKEND.splice(idx, 1);
      }
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


