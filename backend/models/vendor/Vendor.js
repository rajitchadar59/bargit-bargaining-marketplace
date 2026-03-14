const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    companyName: { type: String, required: true, unique: true, trim: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    businessType: {
        type: String,
        enum: ['Retailer', 'Wholesaler', 'Manufacturer', 'Home Business'],
        default: 'Retailer'
    },
    category: { type: String, required: true },
    description: { type: String, maxLength: 500 },
    
    shopAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], 
                default: [0, 0]
            }
        }
    },

    
    bankDetails: {
        accountHolderName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
        bankName: { type: String },
        upiId: { type: String }
    },

    subscription: {
        planId: { type: String, default: 'free' }, 
        planName: { type: String, default: 'Free Tier' }, 
        status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date }, 
        productLimit: { type: Number, default: 5 }, 
        platformFee: { type: Number, default: 0 },
        razorpayOrderId: { type: String }, 
        razorpayPaymentId: { type: String }, 
        lastPaymentAmount: { type: Number, default: 0 }, 
        lastPaymentDate: { type: Date }
    },

    rating: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

VendorSchema.index({ "shopAddress.location": "2dsphere" });

module.exports = mongoose.model('Vendor', VendorSchema);