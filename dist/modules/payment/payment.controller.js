import Stripe from 'stripe';
import { Payment } from '../../models/payment.model.js';
import { Item } from '../../models/Item.js';
const getStripeInstance = () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-08-26.dahlia',
    });
};
// ১. স্ট্রাইপ চেকআউট সেশন তৈরি করা
export const createCheckoutSession = async (req, res) => {
    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            res.status(400).json({ success: false, message: 'STRIPE_SECRET_KEY is missing in environment variables.' });
            return;
        }
        const stripe = getStripeInstance();
        const { itemId, title, cost, paymentType } = req.body;
        const parsedCost = Number(cost) || 100;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: title || 'Eco Project Funding',
                        },
                        unit_amount: Math.round(parsedCost * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                paymentType: paymentType || 'project-fund', // Stored in Stripe metadata for tracking
                itemId,
            },
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/explore/item/${itemId}?success=true&amount=${parsedCost}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/explore/item/${itemId}?canceled=true`,
        });
        res.status(200).json({ success: true, url: session.url });
    }
    catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};
// ২. পেমেন্ট সফল হওয়ার পর ডাটাবেজে রেকর্ড এবং প্রজেক্ট-ওয়াইজ ব্যাজ সেভ করা
export const savePaymentRecord = async (req, res) => {
    try {
        const { itemId, title, amount, sessionId, paymentType } = req.body;
        const existingPayment = await Payment.findOne({ transactionId: sessionId });
        if (existingPayment) {
            res.status(200).json({ success: true, message: 'Payment already recorded', data: existingPayment });
            return;
        }
        const parsedAmount = Number(amount) || 100;
        let assignedBadge = 'Supporter Badge';
        if (parsedAmount >= 500) {
            assignedBadge = 'Gold Partner';
        }
        else if (parsedAmount >= 100) {
            assignedBadge = 'Bronze Green Contributor';
        }
        const newPayment = await Payment.create({
            itemId,
            title,
            amount: parsedAmount,
            transactionId: sessionId || `txn_${Date.now()}`,
            userEmail: req.body.userEmail,
            paymentType: paymentType || 'project-fund',
            status: 'success',
            badge: assignedBadge,
        });
        // **মূল সমাধান:** পেমেন্ট সফলভাবে রেকর্ড হওয়ার পর সংশ্লিষ্ট প্রজেক্টের totalFunded আপডেট করুন
        await Item.findByIdAndUpdate(itemId, {
            $inc: { totalFunded: parsedAmount }
        });
        res.status(201).json({ success: true, data: newPayment });
    }
    catch (error) {
        console.error('Save Payment Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// নির্দিষ্ট প্রজেক্টের (itemId) সমস্ত পেমেন্ট বা ফান্ডিং রেকর্ড ফেচ করার জন্য
export const getPaymentsByItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const payments = await Payment.find({ itemId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: payments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// নির্দিষ্ট ইউজারের বা সব পেমেন্ট এবং ব্যাজ দেখার জন্য
export const getUserPayments = async (req, res) => {
    try {
        const email = req.query.email; // এখানে string হিসেবে কাস্ট করা হয়েছে
        // ইমেইল থাকলে ফিল্টার হবে, না থাকলে সব পেমেন্ট দেখাবে
        const query = email ? { userEmail: email } : {};
        const payments = await Payment.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: payments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
