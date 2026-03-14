const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: String,
        productImage: String,
        priceAtPurchase: Number, 
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        name: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        pin: String,
        location: {
            type: { type: String, default: 'Point' },
            coordinates: [Number]
        }
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);