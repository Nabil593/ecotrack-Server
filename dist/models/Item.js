import mongoose, { Schema } from 'mongoose';
const itemSchema = new Schema({
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
export const Item = mongoose.models.Item || mongoose.model('Item', itemSchema, 'item');
