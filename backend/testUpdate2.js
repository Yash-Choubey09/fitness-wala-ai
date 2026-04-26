import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

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
    user.targetWeight = 70;
    user.fitnessGoal = 'maintenance';
    
    // Simulate validation
    const err = user.validateSync();
    if (err) {
      console.log('Validation Error:', err);
    } else {
      console.log('Validation Passed');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

test();
