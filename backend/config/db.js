import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[FATAL ERROR] MONGODB_URI environment variable is missing! Server refusing to start.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: 'hypril',
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error('[FATAL ERROR] MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB Error]', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Notice] MongoDB disconnected. Attempting reconnection...');
});
