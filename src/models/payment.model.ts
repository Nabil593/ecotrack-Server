import { Schema, model, Document } from 'mongoose';

interface IPayment extends Document {
  itemId: string;
  title: string;
  amount: number;
  transactionId: string;
  paymentType: string;
  status: string;
  userEmail: string;
  badge: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
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

export const Payment = model<IPayment>('Payment', paymentSchema);