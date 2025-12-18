import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} from "../Controllers/CategoryController.js";

const router = express.Router();

// Create a new category (temp: removed protect middleware for testing)
router.post('/add', createCategory);

// Get all categories
router.get('/all', getAllCategories);

// Get a single category by ID
router.get('/:id', getCategoryById);

// Update a category
router.put('/:id', updateCategory);

// Delete a category
router.delete('/:id', deleteCategory);

export default router;