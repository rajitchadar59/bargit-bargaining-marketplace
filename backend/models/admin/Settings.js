const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    platformName: { type: String, default: 'Bargit' },
    supportEmail: { type: String, default: 'support@bargit.com' },
    supportPhone: { type: String, default: '+91 9876543210' },
    minPayoutThreshold: { type: Number, default: 500 },
    maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);