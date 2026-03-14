const mongoose = require('mongoose');

const VendorWalletSchema = new mongoose.Schema({
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor', 
        required: true, 
        unique: true 
    },
    availableBalance: { 
        type: Number, 
        default: 0 
    },
    pendingBalance: { 
        type: Number, 
        default: 0 
    },
    lifetimeEarnings: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('VendorWallet', VendorWalletSchema);