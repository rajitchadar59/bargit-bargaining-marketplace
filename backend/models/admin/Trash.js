const mongoose = require('mongoose');

const TrashSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    vendorData: { type: Object, required: true }, 
    productsData: { type: Array, default: [] },   
    deletedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trash', TrashSchema);