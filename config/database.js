import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const { MONGO_URL } = process.env;
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined in the environment variables.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(MONGO_URL, {
    autoIndex: false
  });
};
