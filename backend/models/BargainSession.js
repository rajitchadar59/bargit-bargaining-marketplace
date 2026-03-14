const mongoose = require('mongoose');

const BargainSessionSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Won', 'Expired', 'Locked', 'Purchased'],
        default: 'Active'
    },
    agreedPrice: {
        type: Number,
        default: null
    },
    bargainExpiresAt: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    chatHistory: [{
        sender: { type: String, enum: ['user', 'seller'] },
        text: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

BargainSessionSchema.index({ customerId: 1, productId: 1, createdAt: 1 });

module.exports = mongoose.model('BargainSession', BargainSessionSchema);