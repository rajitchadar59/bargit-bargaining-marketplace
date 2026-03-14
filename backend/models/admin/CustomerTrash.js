const mongoose = require('mongoose');

const CustomerTrashSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userData: { type: Object, required: true }, 
    deletedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CustomerTrash', CustomerTrashSchema);