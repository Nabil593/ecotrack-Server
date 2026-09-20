import { Router } from 'express';
import { createItem, deleteItem, getItemById, getItems, getItemsByUser, getItemsByUserEmail, getUserStats, updateItem } from '../modules/item/item.controller.js';

const router = Router();

router.get('/user/stats', getUserStats);
router.get('/user/id/:userId', getItemsByUser);      
router.get('/user/email/:email', getItemsByUserEmail); 

router.post('/', createItem);

router.get('/', getItems);

router.put('/:id', updateItem);     
router.delete('/:id', deleteItem); 
router.get('/:id', getItemById);

export default router;