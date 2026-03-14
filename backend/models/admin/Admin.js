const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'moderator'], default: 'superadmin' },
    lastLogin: { type: Date }
}, { timestamps: true });



module.exports = mongoose.model('Admin', adminSchema);