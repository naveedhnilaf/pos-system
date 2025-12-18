import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } from '../Controllers/OrderController.js';

const orderRoutes = express.Router();

orderRoutes.post('/add', createOrder);
orderRoutes.get('/all', getAllOrders);
orderRoutes.get('/:id', getOrderById);
orderRoutes.put('/:id', updateOrder);
orderRoutes.delete('/:id', deleteOrder);

export default orderRoutes;
