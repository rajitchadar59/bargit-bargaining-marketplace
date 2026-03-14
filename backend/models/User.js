const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    type: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] } 
    }
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String }, 
    password: { type: String, required: true },
    addresses: [AddressSchema], 
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ],

    wishlist: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }],

    createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ "addresses.location": "2dsphere" });

module.exports = mongoose.model('User', UserSchema);