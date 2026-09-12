import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Omit<Document, '_id'> {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  impactScore: number;
  cost: number;
  fundingGoal: number;
  location: string;
  imageUrl: string;
  userId: string;
  userEmail: string;
  aiAnalysisReport: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const itemSchema = new Schema<IItem>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  category: { 
    type: String, 
    required: true 
  },
  impactScore: { type: Number, required: true },
  cost: { type: Number, required: true },
  fundingGoal: { type: Number, required: true },
  location: { type: String, default: 'Global Enterprise' },
  imageUrl: { type: String },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  aiAnalysisReport: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Item = mongoose.models.Item || mongoose.model<IItem>('Item', itemSchema, 'item');