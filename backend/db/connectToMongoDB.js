import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB`);
  } catch (error) {
    error.message = `Failed to connect to MongoDB: ${error.message}`;
    throw error;
  }
};

export default connectToMongoDB;
