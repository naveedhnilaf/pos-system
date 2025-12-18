import bcrypt from 'bcrypt';
import User from './Models/User.js';
import connectDB from './db/connection.js';

const seedUsers = async () => {
    try {
        await connectDB();
        const hashPassword =await bcrypt.hash('admin', 10);
        const newUser = new User({
            name: 'admin',
            email: 'admin@gmail.com',
            password: hashPassword,
            role: 'admin'
        });
        await newUser.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

seedUsers();
