import { Product } from '../models/Product.js';

const MOCK_PRODUCTS_BACKEND = [
  {
    _id: "prod_hypril_oil",
    id: "prod_hypril_oil",
    name: "Hypril™ Enlargement Oil (100 ml)",
    slug: "hypril-enlargement-oil",
    category: "Sexual Wellness",
    price: 799,
    comparePrice: 1299,
    rating: 4.95,
    reviewCount: 482,
    stock: 100,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "Enhances size, improves stamina & boosts blood flow. Formulated for peak performance.",
    description: "Hypril™ Enlargement Oil is a high-potency male enhancement topical formulation engineered to boost blood circulation, improve tissue stamina, and support natural firmness.",
    images: ["/images/hypril_oil.jpg"],
    benefits: ["Enhances size & firmness", "Improves stamina & blood flow"],
    ingredients: "Pure Ashwagandha Root Extract, Gokshura Oil, Shatavari, Clove Oil, Sesame Base, Vitamin E.",
    usage: "Apply 8-10 drops daily and massage gently for 2-3 minutes."
  },
  {
    _id: "prod_hypril_gel",
    id: "prod_hypril_gel",
    name: "Hypril™ Extended Delay Gel (50 ml)",
    slug: "hypril-extended-delay-gel",
    category: "Sexual Wellness",
    price: 699,
    comparePrice: 1099,
    rating: 4.92,
    reviewCount: 360,
    stock: 85,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "Longer performance, climax control & pleasant cooling sensation.",
    description: "Hypril™ Extended Delay Gel is a fast-acting desensitizing gel engineered to control climax timing, delay premature climax, and provide a refreshing cooling sensation.",
    images: ["/images/hypril_delay_gel.jpg"],
    benefits: ["Extends intimacy duration", "Cooling sensation & non-sticky"],
    ingredients: "Lidocaine USP 10% w/v, Menthol Cooling Essence, Aloe Vera Gel Base, Tocopherol.",
    usage: "Apply a pea-sized amount onto the head and shaft 10-15 minutes before intimacy."
  }
];

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    if (products.length > 0) {
      return res.json(products);
    }
    return res.json(MOCK_PRODUCTS_BACKEND);
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


