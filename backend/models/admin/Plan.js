const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    planType: { type: String, enum: ['free', 'fixed', 'flexible'], required: true },

    price: { type: Number, default: 0 },
    period: { type: Number, required: true },
    productLimit: { type: Number, required: true },


    pricePerDay: { type: Number, default: 0 },
    pricePerProduct: { type: Number, default: 0 },

    platformFee: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);