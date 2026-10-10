import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';

const updateProductStats = async (productIdStr) => {
  if (!productIdStr) return;
  try {
    const reviews = await Review.find({ productIdStr });
    const reviewCount = reviews.length;
    const avgRating = reviewCount > 0
      ? Math.round((reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewCount) * 10) / 10
      : 5.0;

    const query = [{ slug: productIdStr }];
    if (mongoose.isValidObjectId(productIdStr)) {
      query.push({ _id: productIdStr });
    }

    await Product.findOneAndUpdate(
      { $or: query },
      { rating: avgRating, reviewCount }
    );
  } catch (e) {
    console.error('Error updating product stats:', e);
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productIdStr: productId }).sort({ createdAt: -1 });
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

    const cleanTitle = (title || '').replace(/<[^>]*>?/gm, '').trim();
    const cleanComment = comment.replace(/<[^>]*>?/gm, '').trim();

    const existing = await Review.findOne({ productIdStr: productId, user: userId });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a review for this product.' });
    }

    let productDoc = null;
    const query = [{ slug: productId }];
    if (mongoose.isValidObjectId(productId)) {
      query.push({ _id: productId });
    }
    productDoc = await Product.findOne({ $or: query });

    const review = await Review.create({
      product: productDoc ? productDoc._id : productId,
      productIdStr: productId,
      user: userId,
      name: userName,
      rating: numRating,
      title: cleanTitle,
      comment: cleanComment,
      image: image || null,
      verified: true,
    });

    await updateProductStats(productId);
    return res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already submitted a review for this product.' });
    }
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

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own review' });
    }

    review.rating = numRating;
    review.title = cleanTitle;
    review.comment = cleanComment;
    await review.save();

    await updateProductStats(review.productIdStr);
    return res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (!isAdmin && review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own review' });
    }

    const productIdStr = review.productIdStr;
    await Review.findByIdAndDelete(id);

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
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
