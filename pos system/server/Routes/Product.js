import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../Controllers/ProductController.js';

const productRoutes = express.Router();

productRoutes.post('/add', createProduct);
productRoutes.get('/all', getAllProducts);
productRoutes.get('/:id', getProductById);
productRoutes.put('/:id', updateProduct);
productRoutes.delete('/:id', deleteProduct);

export default productRoutes;
