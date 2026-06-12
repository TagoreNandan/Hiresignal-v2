import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectMongo(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}


// async - to wait

//entire code is for Mongoose connection 
