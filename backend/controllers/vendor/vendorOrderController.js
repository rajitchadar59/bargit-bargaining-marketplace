const Order = require('../../models/Order');
const VendorWallet = require('../../models/vendor/VendorWallet');
const Transaction = require('../../models/vendor/Transaction');

exports.getVendorOrders = async (req, res) => {
    try {
        const vendorId = req.userId; 
        const orders = await Order.find({ vendorId })
            .populate('customerId', 'username email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body; 
        const vendorId = req.userId;

        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(orderStatus)) return res.status(400).json({ success: false, message: "Invalid Status" });

        const orderToUpdate = await Order.findOne({ _id: orderId, vendorId: vendorId });
        if (!orderToUpdate) return res.status(404).json({ success: false, message: "Order not found" });

        if (orderToUpdate.orderStatus === 'Delivered') return res.status(400).json({ success: false, message: "Already delivered" });

        let updateData = { orderStatus: orderStatus };

        if (orderStatus === 'Delivered') {
            if (orderToUpdate.paymentMethod === 'cod') updateData.paymentStatus = 'Completed';

            let wallet = await VendorWallet.findOne({ vendorId });
            if (!wallet) wallet = await VendorWallet.create({ vendorId });

            wallet.lifetimeEarnings += orderToUpdate.totalAmount;

            if (orderToUpdate.paymentMethod === 'online') {
                wallet.availableBalance += orderToUpdate.totalAmount;
                wallet.pendingBalance = Math.max(0, wallet.pendingBalance - orderToUpdate.totalAmount);
            }
            await wallet.save();

            await Transaction.create({
                vendorId: vendorId, 
                orderId: orderToUpdate._id, 
                type: 'credit',
                amount: orderToUpdate.totalAmount, 
                paymentMethod: orderToUpdate.paymentMethod, 
                status: 'Completed', 
                description: `Sale completed for Order #${orderToUpdate._id.toString().slice(-4).toUpperCase()}`
            });
        }

      
        if (orderStatus === 'Cancelled') {
            if (orderToUpdate.paymentMethod === 'cod') updateData.paymentStatus = 'Failed';
            else if (orderToUpdate.paymentMethod === 'online') {
                let wallet = await VendorWallet.findOne({ vendorId });
                if (wallet) {
                    wallet.pendingBalance = Math.max(0, wallet.pendingBalance - orderToUpdate.totalAmount);
                    await wallet.save();
                }
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { returnDocument: 'after' }).populate('customerId', 'username email phone');

        res.status(200).json({ success: true, message: `Status updated to ${orderStatus}`, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};