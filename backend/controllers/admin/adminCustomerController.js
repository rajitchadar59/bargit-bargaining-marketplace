const User = require('../../models/User');
const Order = require('../../models/Order');
const CustomerTrash = require('../../models/admin/CustomerTrash');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find().select('-password').sort({ createdAt: -1 }).lean();
        
        const orderStats = await Order.aggregate([
            { 
                $group: { 
                    _id: "$customerId", 
                    totalOrders: { $sum: 1 }, 
                    cancelledOrders: { 
                        $sum: { $cond: [{ $eq: ["$orderStatus", "Cancelled"] }, 1, 0] } 
                    },
                    totalSpent: { 
                        $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, "$totalAmount", 0] } 
                    } 
                } 
            }
        ]);

        const customerData = customers.map(customer => {
            const stats = orderStats.find(o => o._id?.toString() === customer._id.toString()) || { 
                totalOrders: 0, 
                cancelledOrders: 0, 
                totalSpent: 0 
            };
            return {
                ...customer,
                stats: stats
            };
        });

        res.status(200).json({ success: true, count: customerData.length, data: customerData });
    } catch (error) {
        console.error("Fetch Customers Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.moveToTrash = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'Customer not found' });

        await CustomerTrash.create({
            userId: user._id,
            userData: user.toObject()
        });

        await User.findByIdAndDelete(userId);

        res.status(200).json({ success: true, message: 'Customer moved to Trash.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getTrashedCustomers = async (req, res) => {
    try {
        const trashed = await CustomerTrash.find().sort({ deletedAt: -1 });
        res.status(200).json({ success: true, data: trashed });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.recoverCustomer = async (req, res) => {
    try {
        const trashId = req.params.id;

        const trashedItem = await CustomerTrash.findById(trashId);
        if (!trashedItem) return res.status(404).json({ success: false, message: 'Not found in trash' });

        await User.create(trashedItem.userData);
        await CustomerTrash.findByIdAndDelete(trashId);

        res.status(200).json({ success: true, message: 'Customer recovered successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.permanentlyDeleteCustomer = async (req, res) => {
    try {
        const trashId = req.params.id;
        await CustomerTrash.findByIdAndDelete(trashId);
        res.status(200).json({ success: true, message: 'Customer permanently deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};