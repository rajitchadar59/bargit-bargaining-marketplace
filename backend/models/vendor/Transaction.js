const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor', 
        required: true 
    },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order' 
    },
    type: { 
        type: String, 
        enum: ['credit', 'withdrawal', 'fee_deduction'], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ['online', 'cod', 'bank_transfer'] 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Completed', 'Failed'], 
        default: 'Completed' 
    },
    description: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);