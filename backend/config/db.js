// MongoDB Database Configuration
import mongoose from 'mongoose';
import User from '../models/User.js';

const connectWithUri = async (uri) => {
  const conn = await mongoose.connect(uri);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }

  if (process.env.NODE_ENV !== 'production') {
    const usersCount = await User.countDocuments();
    console.log(`Database read successful. Total users in DB: ${usersCount}`);
  }
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;

  if (!primaryUri) {
    console.error('Error connecting to MongoDB: MONGO_URI is not set.');
    process.exit(1);
  }

  try {
    await connectWithUri(primaryUri);
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    console.error('Make sure your current IP address is allowlisted in MongoDB Atlas Network Access.');
    process.exit(1);
  }
};

export default connectDB;