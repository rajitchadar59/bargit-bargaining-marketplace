const Vendor = require('../../models/vendor/Vendor');
const User = require('../../models/User');
const Product = require('../../models/vendor/Product');
const Order = require('../../models/Order');

exports.getDashboardStats = async (req, res) => {
    try {
        const vendorCount = await Vendor.countDocuments();
        const customerCount = await User.countDocuments();
        const productCount = await Product.countDocuments();

        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: 'Delivered' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const recentVendors = await Vendor.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('companyName ownerName email createdAt');

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    vendors: vendorCount,
                    customers: customerCount,
                    products: productCount,
                    revenue: totalRevenue
                },
                recentVendors
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};