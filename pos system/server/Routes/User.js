import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, changePassword } from '../Controllers/UserController.js';

const userRoutes = express.Router();

userRoutes.post('/add', createUser);
userRoutes.get('/all', getAllUsers);
userRoutes.get('/:id', getUserById);
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:id', deleteUser);
userRoutes.post('/:id/change-password', changePassword);

export default userRoutes;
