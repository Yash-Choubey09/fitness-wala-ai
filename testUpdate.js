import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      process.exit(0);
    }

    console.log('Found user:', user.email);
    user.weight = 80;
    
    // Simulate save
    await user.save();
    console.log('User saved successfully');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

test();
