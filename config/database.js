import mongoose from 'mongoose';

let isConnected = false;

export const connectDatabase = async () => {
  const { MONGO_URL, ENABLE_API_LOGS } = process.env;
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined in the environment variables.');
  }

  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose.set('strictQuery', true);

  if (ENABLE_API_LOGS === 'true') {
    mongoose.set('debug', true);
    console.log('[Database] Mongoose debug logging is enabled.');
  }

  try {
    console.log('[Database] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL, {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    isConnected = true;
    console.log('[Database] MongoDB connection established.');
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    throw error;
  }
};
