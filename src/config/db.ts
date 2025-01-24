import mongoose from "mongoose";
import dotenv from 'dotenv';
import { userModel } from '../models/userSchema';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

export const connectDB = async (): Promise<void> => {
  // console.log(mongoURI, 'mongoURI');
  try {
    // Connect to MongoDB using the URI from .env
    await mongoose.connect(mongoURI, {});
    // await userModel.createCollection(); // Insert document based on schema
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
