import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hypril_wellness';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Notice] Local MongoDB service offline. API running with persistent JSON store fallback.`);
    return false;
  }
};
