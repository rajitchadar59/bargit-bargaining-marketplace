const Order = require('../../models/Order');
const Product = require('../../models/vendor/Product');
const Vendor = require('../../models/vendor/Vendor');
const mongoose = require('mongoose');

exports.getDashboardAnalytics = async (req, res) => {
    try {
        const vendorId = req.userId;
        const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
        const range = req.query.range || '7';

        const allOrders = await Order.find({ vendorId });
        const allProducts = await Product.find({ vendorId });
        const vendor = await Vendor.findById(vendorId);

        let totalRevenue = 0;
        let aiDealsCount = 0;

        const statusCounts = {
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0
        };

        allOrders.forEach(order => {
            if (statusCounts[order.orderStatus] !== undefined) {
                statusCounts[order.orderStatus]++;
            }
            if (order.orderStatus === 'Delivered') {
                totalRevenue += order.totalAmount;
            }
            if (order.items.some(i => i.priceAtPurchase < i.mrp)) {
                aiDealsCount++;
            }
        });

        let trendLabels = [];
        let trendValues = [];
        const revenueByTime = {};

        if (range === 'year') {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentYear = new Date().getFullYear();
            monthNames.forEach(m => revenueByTime[m] = 0);

            allOrders.forEach(order => {
                if (order.orderStatus === 'Delivered') {
                    const orderDate = new Date(order.createdAt);
                    if (orderDate.getFullYear() === currentYear) {
                        const month = orderDate.getMonth();
                        revenueByTime[monthNames[month]] += order.totalAmount;
                    }
                }
            });
            trendLabels = monthNames;
            trendValues = monthNames.map(m => revenueByTime[m]);
        } else {
            const days = parseInt(range) || 7;
            const lastNDays = [...Array(days)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();

            lastNDays.forEach(day => revenueByTime[day] = 0);

            allOrders.forEach(order => {
                if (order.orderStatus === 'Delivered') {
                    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
                    if (revenueByTime[orderDate] !== undefined) {
                        revenueByTime[orderDate] += order.totalAmount;
                    }
                }
            });

            trendLabels = lastNDays.map(date => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
            trendValues = Object.values(revenueByTime);
        }

        const productStats = await Order.aggregate([
            { $match: { vendorId: vendorObjectId, orderStatus: 'Delivered' } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productName",
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.priceAtPurchase"] } }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        const topProductsLabels = productStats.map(p => p._id);
        const topProductsData = productStats.map(p => p.totalRevenue);

        const productLimit = vendor?.subscription?.productLimit || 0;
        const activeProducts = allProducts.filter(p => p.status !== 'Draft').length;

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalRevenue,
                    totalOrders: allOrders.length,
                    aiDealsClosed: aiDealsCount,
                    activeProducts,
                    productLimit
                },
                charts: {
                    revenueTrend: { labels: trendLabels, data: trendValues },
                    topProducts: {
                        labels: topProductsLabels.length > 0 ? topProductsLabels : ['No Sales Yet'],
                        data: topProductsData.length > 0 ? topProductsData : [0]
                    },
                    orderStatus: { labels: Object.keys(statusCounts), data: Object.values(statusCounts) }
                }
            }
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};