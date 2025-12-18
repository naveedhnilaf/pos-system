import express from 'express';
import { login } from '../Controllers/authController.js';

const router = express.Router();

// Use the real login controller (checks DB and passwords)
router.post('/login', login);

export default router;