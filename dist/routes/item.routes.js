import { Router } from 'express';
import { createItem, deleteItem, getItemById, getItems, getItemsByUser, getItemsByUserEmail, getUserStats, updateItem } from '../modules/item/item.controller.js';
const router = Router();
// ১. প্রথমে সমস্ত স্পেসিফিক বা স্ট্যাটিক রাউটগুলো রাখতে হবে (যাতে এক্সপ্রেস ভুল করে :id না ধরে)
router.get('/user/stats', getUserStats);
router.get('/user/id/:userId', getItemsByUser);
router.get('/user/email/:email', getItemsByUserEmail);
// ২. পোস্ট রিকোয়েস্টের জন্য রাউট
router.post('/', createItem);
// Get All Items
router.get('/', getItems);
// ৪. নির্দিষ্ট আইডির ওপর বেস করে PUT, DELETE এবং GET রাউট (ডায়নামিক রাউট সবসময় নিচে থাকবে)
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.get('/:id', getItemById);
export default router;
