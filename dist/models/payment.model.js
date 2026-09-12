import { Schema, model } from 'mongoose';
const paymentSchema = new Schema({
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    paymentType: { type: String, default: 'project-fund' }, // Updated default schema value
    status: { type: String, default: 'success' },
    badge: { type: String, default: 'Bronze Green Contributor' },
    createdAt: { type: Date, default: Date.now },
});
export const Payment = model('Payment', paymentSchema);
