// payment.route.ts ফাইলটি এভাবে আপডেট করুন:

import { Router } from 'express';
import { createCheckoutSession, getPaymentsByItem, getUserPayments, savePaymentRecord } from '../modules/payment/payment.controller';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/save-payment', savePaymentRecord);
router.get('/item/:itemId', getPaymentsByItem); 
router.get('/my-payments', getUserPayments);

export default router;