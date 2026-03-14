const mongoose = require('mongoose');
const Admin = require('../models/admin/Admin');
const bcrypt = require('bcryptjs'); 

const createAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
        
        if (!adminExists) {
         
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);

            await Admin.create({
                name: process.env.SUPER_ADMIN_NAME,
                email: process.env.SUPER_ADMIN_EMAIL,
                password: hashedPassword, 
                role: 'admin'
            });
            console.log("✅ Super Admin auto-created successfully!");
        } else {
            console.log("⚡ Super Admin already exists.");
        }
    } catch (error) {
        console.error('Admin creation failed:', error.message);
    }
};

module.exports = createAdmin;