import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  companyName?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  subscriptionPlan: 'free' | 'basic' | 'enterprise';
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  image: { type: String, default: '' },
  companyName: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  subscriptionPlan: { 
    type: String, 
    enum: ['free', 'basic', 'enterprise'], 
    default: 'free' 
  },
  stripeCustomerId: { type: String, default: '' },
}, {
  timestamps: true, // এটি স্বয়ংক্রিয়ভাবে createdAt এবং updatedAt হ্যান্ডেল করবে
});

export const User = model<IUser>('User', userSchema);