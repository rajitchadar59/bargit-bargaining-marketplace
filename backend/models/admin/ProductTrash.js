const mongoose = require('mongoose');

const ProductTrashSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productData: { type: Object, required: true }, 
    deletedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProductTrash', ProductTrashSchema);