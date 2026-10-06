import { Product } from '../models/Product.js';

const MOCK_PRODUCTS_BACKEND = [
  {
    _id: "prod_1",
    id: "prod_1",
    name: "VYRO Surge — Endurance & Stamina Gummies",
    slug: "vyro-surge-endurance-stamina-gummies",
    category: "Sexual Wellness",
    price: 699,
    comparePrice: 999,
    rating: 4.9,
    reviewCount: 342,
    stock: 45,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "L-Arginine, Gokshura & Safed Musli gummies for elevated blood flow & lasting vigor.",
    description: "Doctor-formulated daily gummies engineered for natural nitric oxide elevation, increased circulation, and enhanced bedroom endurance. Formulated with pure Gokshura, Safed Musli, and L-Arginine.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Boosts Nitric Oxide production", "Increases stamina"],
    ingredients: "Gokshura Extract (250mg), Safed Musli (200mg), L-Arginine (500mg).",
    usage: "Chew 2 gummies daily after meals."
  },
  {
    _id: "prod_2",
    id: "prod_2",
    name: "Pure Himalayan Shilajit Gold Resin",
    slug: "pure-himalayan-shilajit-gold-resin",
    category: "Daily Performance",
    price: 1299,
    comparePrice: 1799,
    rating: 4.95,
    reviewCount: 512,
    stock: 28,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: ">75% Fulvic Acid purified soft resin enriched with 24K edible Gold Vasma.",
    description: "Harvested from high-altitude Himalayan peaks above 18,000 ft.",
    images: ["https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800"],
    ingredients: "100% Pure Himalayan Shilajit Resin, Swarna Bhasma (24K Gold).",
    usage: "Dissolve pea-sized portion in warm milk."
  },
  {
    _id: "prod_3",
    id: "prod_3",
    name: "VYRO Apex — 5% Minoxidil + Redensyl Hair Growth Drops",
    slug: "vyro-apex-minoxidil-redensyl-hair-growth-drops",
    category: "Grooming & Beard",
    price: 899,
    comparePrice: 1299,
    rating: 4.8,
    reviewCount: 289,
    stock: 60,
    isBestSeller: false,
    isFeatured: true,
    benefitSummary: "Clinically proven formula for reactivating dormant scalp hair follicles & thickening beard density.",
    description: "Non-greasy hair growth tonic engineered with 5% Minoxidil.",
    images: ["https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=800"],
    ingredients: "Minoxidil 5%, Redensyl 3%, Procapil 2%, Saw Palmetto.",
    usage: "Apply 1ml twice daily."
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
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

