const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    role: { 
        type: String, 
        enum: ['buyer', 'seller'], 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);