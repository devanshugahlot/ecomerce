import mongoose from 'mongoose';
import { Product } from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const query = [{ slug: slug }];
    if (mongoose.isValidObjectId(slug)) {
      query.push({ _id: slug });
    }

    const product = await Product.findOne({ $or: query });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
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

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const product = new Product({
      ...req.body,
      slug,
      category: category || 'General',
      price: Number(price),
      comparePrice: Number(req.body.comparePrice || price * 1.4),
      stock: Number(req.body.stock || 50),
    });

    const saved = await product.save();
    return res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const query = [{ slug: id }];
    if (mongoose.isValidObjectId(id)) {
      query.push({ _id: id });
    }

    const updated = await Product.findOneAndUpdate(
      { $or: query },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const query = [{ slug: id }];
    if (mongoose.isValidObjectId(id)) {
      query.push({ _id: id });
    }

    const deleted = await Product.findOneAndDelete({ $or: query });
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
