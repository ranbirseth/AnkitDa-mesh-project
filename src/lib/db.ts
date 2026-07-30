import mongoose from 'mongoose';
import { env } from './env';

// ================================================================
// MongoDB Connection setup for Next.js Serverless Environment
// Cache connection across hot reloads in development
// ================================================================

if (!env?.MONGODB_URI) {
  console.warn('[db] MONGODB_URI is not defined in environment variables. Database operations will fail.');
}

const MONGODB_URI = env?.MONGODB_URI || 'mongodb://localhost:27017/ankitdamess';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.warn('[db] Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.warn('[db] Connected to MongoDB');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
