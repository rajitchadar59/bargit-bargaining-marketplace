const Vendor = require('../../models/vendor/Vendor');
const Product = require('../../models/vendor/Product');
const Order = require('../../models/Order');
const VendorWallet = require('../../models/vendor/VendorWallet');
const Trash = require('../../models/admin/Trash'); 
const mongoose = require('mongoose');

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().select('-password').sort({ createdAt: -1 }).lean();
        const wallets = await VendorWallet.find().lean();

        
        const productCounts = await Product.aggregate([{ $group: { _id: "$vendorId", count: { $sum: 1 } } }]);
        
        const orderCounts = await Order.aggregate([{ $group: { _id: "$vendorId", count: { $sum: 1 } } }]);
        
        const earningsSplit = await Order.aggregate([
            { $match: { orderStatus: 'Delivered' } },
            { $group: { 
                _id: { vendorId: "$vendorId", method: "$paymentMethod" }, 
                total: { $sum: "$totalAmount" } 
            }}
        ]);

        const vendorData = vendors.map(vendor => {
            const vId = vendor._id.toString();
            const wallet = wallets.find(w => w.vendorId.toString() === vId) || { availableBalance: 0, pendingBalance: 0, lifetimeEarnings: 0 };
            
            const prodCount = productCounts.find(p => p._id?.toString() === vId)?.count || 0;
            const ordCount = orderCounts.find(o => o._id?.toString() === vId)?.count || 0;
            
            let codEarnings = 0;
            let onlineEarnings = 0;
            
            earningsSplit.forEach(e => {
                if (e._id.vendorId?.toString() === vId) {
                    if (e._id.method === 'cod') codEarnings += e.total;
                    if (e._id.method === 'online') onlineEarnings += e.total;
                }
            });

            return {
                ...vendor,
                walletInfo: wallet,
                stats: {
                    totalProducts: prodCount,
                    totalOrders: ordCount,
                    codEarnings: codEarnings,
                    onlineEarnings: onlineEarnings
                }
            };
        });

        res.status(200).json({ success: true, count: vendorData.length, data: vendorData });
    } catch (error) {
        console.error("Vendor Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.moveToTrash = async (req, res) => {
    try {
        const vendorId = req.params.id;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const products = await Product.find({ vendorId: vendorId });

        await Trash.create({
            vendorId: vendor._id,
            vendorData: vendor.toObject(),
            productsData: products.map(p => p.toObject())
        });

        await Product.deleteMany({ vendorId: vendorId });
        await Vendor.findByIdAndDelete(vendorId);

        res.status(200).json({ success: true, message: 'Vendor and all products moved to Trash safely.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getTrashedVendors = async (req, res) => {
    try {
        const trashed = await Trash.find().sort({ deletedAt: -1 });
        res.status(200).json({ success: true, data: trashed });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.recoverVendor = async (req, res) => {
    try {
        const trashId = req.params.id;

        const trashedItem = await Trash.findById(trashId);
        if (!trashedItem) return res.status(404).json({ success: false, message: 'Not found in trash' });

        await Vendor.create(trashedItem.vendorData);
        if (trashedItem.productsData.length > 0) {
            await Product.insertMany(trashedItem.productsData);
        }

        await Trash.findByIdAndDelete(trashId);

        res.status(200).json({ success: true, message: 'Vendor and products recovered successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};




exports.permanentlyDeleteVendor = async (req, res) => {
    try {
        const trashId = req.params.id;

        const trashedItem = await Trash.findById(trashId);
        if (!trashedItem) return res.status(404).json({ success: false, message: 'Not found in trash' });

        await Trash.findByIdAndDelete(trashId);

        res.status(200).json({ success: true, message: 'Vendor permanently deleted from system.' });
    } catch (error) {
        console.error("Permanent Delete Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};