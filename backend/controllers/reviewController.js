import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { getStore, saveStore } from '../config/store.js';

// Helper to update product rating & review count
const updateProductStats = async (productIdStr) => {
  const store = getStore();
  let reviews = [];

  try {
    reviews = await Review.find({ productIdStr });
  } catch (e) {
    reviews = store.reviews.filter((r) => r.productIdStr === productIdStr);
  }

  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Math.round((reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewCount) * 10) / 10
    : 5.0;

  try {
    await Product.findOneAndUpdate(
      { $or: [{ _id: productIdStr }, { slug: productIdStr }] },
      { rating: avgRating, reviewCount }
    );
  } catch (e) {}

  const pIdx = store.products.findIndex((p) => p._id === productIdStr || p.slug === productIdStr || p.id === productIdStr);
  if (pIdx > -1) {
    store.products[pIdx].rating = avgRating;
    store.products[pIdx].reviewCount = reviewCount;
    saveStore(store);
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    try {
      const reviews = await Review.find({ productIdStr: productId }).sort({ createdAt: -1 });
      if (reviews && reviews.length > 0) return res.json(reviews);
    } catch (e) {}

    const store = getStore();
    const reviews = store.reviews.filter((r) => r.productIdStr === productId);
    return res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const productId = req.params.productId || req.body.productId || req.body.product;
    const { rating, title, comment, image } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || 'Verified Customer';

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Review comment text is required' });
    }

    const numRating = Number(rating || 5);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    // Sanitize comment & title
    const cleanTitle = (title || '').replace(/<[^>]*>?/gm, '').trim();
    const cleanComment = comment.replace(/<[^>]*>?/gm, '').trim();

    // Check if user already reviewed this product
    try {
      const existing = await Review.findOne({ productIdStr: productId, user: userId });
      if (existing) {
        return res.status(400).json({ message: 'You have already submitted a review for this product.' });
      }
    } catch (e) {}

    const store = getStore();
    const memExisting = store.reviews.find((r) => r.productIdStr === productId && r.user === userId);
    if (memExisting) {
      return res.status(400).json({ message: 'You have already submitted a review for this product.' });
    }

    let savedReview;
    try {
      let productDoc = await Product.findOne({ $or: [{ _id: productId }, { slug: productId }] });
      const pObjId = productDoc ? productDoc._id : null;

      if (pObjId) {
        savedReview = await Review.create({
          product: pObjId,
          productIdStr: productId,
          user: userId,
          name: userName,
          rating: numRating,
          title: cleanTitle,
          comment: cleanComment,
          image: image || null,
          verified: true,
        });
      }
    } catch (e) {}

    if (!savedReview) {
      savedReview = {
        _id: 'rev_' + Date.now(),
        id: 'rev_' + Date.now(),
        productIdStr: productId,
        user: userId,
        name: userName,
        rating: numRating,
        title: cleanTitle,
        comment: cleanComment,
        image: image || null,
        verified: true,
        helpful: 0,
        createdAt: new Date().toISOString(),
      };
      store.reviews.unshift(savedReview);
      saveStore(store);
    }

    await updateProductStats(productId);
    return res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to submit review' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    const numRating = Number(rating || 5);
    const cleanTitle = (title || '').replace(/<[^>]*>?/gm, '').trim();
    const cleanComment = (comment || '').replace(/<[^>]*>?/gm, '').trim();

    try {
      const review = await Review.findById(id);
      if (review) {
        if (review.user.toString() !== userId && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden: You can only edit your own review' });
        }
        review.rating = numRating;
        review.title = cleanTitle;
        review.comment = cleanComment;
        await review.save();
        await updateProductStats(review.productIdStr);
        return res.json(review);
      }
    } catch (e) {}

    const store = getStore();
    const idx = store.reviews.findIndex((r) => r._id === id || r.id === id);
    if (idx > -1) {
      if (store.reviews[idx].user !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You can only edit your own review' });
      }
      store.reviews[idx].rating = numRating;
      store.reviews[idx].title = cleanTitle;
      store.reviews[idx].comment = cleanComment;
      saveStore(store);
      await updateProductStats(store.reviews[idx].productIdStr);
      return res.json(store.reviews[idx]);
    }

    res.status(404).json({ message: 'Review not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let productIdStr = null;

    try {
      const review = await Review.findById(id);
      if (review) {
        if (!isAdmin && review.user.toString() !== userId) {
          return res.status(403).json({ message: 'Forbidden: You can only delete your own review' });
        }
        productIdStr = review.productIdStr;
        await Review.findByIdAndDelete(id);
      }
    } catch (e) {}

    const store = getStore();
    const idx = store.reviews.findIndex((r) => r._id === id || r.id === id);
    if (idx > -1) {
      if (!isAdmin && store.reviews[idx].user !== userId) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own review' });
      }
      productIdStr = store.reviews[idx].productIdStr;
      store.reviews.splice(idx, 1);
      saveStore(store);
    }

    if (productIdStr) {
      await updateProductStats(productIdStr);
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      if (reviews && reviews.length > 0) return res.json(reviews);
    } catch (e) {}

    const store = getStore();
    return res.json(store.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
