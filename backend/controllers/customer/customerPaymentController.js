const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../../models/vendor/Product');
const Order = require('../../models/Order');
const User = require('../../models/User');
const VendorWallet = require('../../models/vendor/VendorWallet'); 
const Vendor = require('../../models/vendor/Vendor'); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPaymentOrder = async (req, res) => {
    try {
        const { items } = req.body; 
        if (!items || items.length === 0) return res.status(400).json({ success: false, message: "No items provided" });

        let totalAmount = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ success: false, message: `Product not found` });
            if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
            totalAmount += (product.mrp * item.quantity);
        }

        const options = {
            amount: totalAmount * 100, 
            currency: "INR",
            receipt: `rcpt_${req.userId.slice(-6)}_${Date.now()}` 
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            key_id: process.env.RAZORPAY_KEY_ID, 
            data: { orderId: order.id, amount: order.amount, currency: order.currency }
        });
    } catch (error) {
        console.error("Razorpay Create Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to create payment order" });
    }
};

exports.verifyPaymentAndPlaceOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, addressId } = req.body;
        const customerId = req.userId;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");
        if (razorpay_signature !== expectedSign) return res.status(400).json({ success: false, message: "Invalid payment signature!" });

        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        
        let expectedTotalAmount = 0;
        for (const item of items) {
             const product = await Product.findById(item.productId);
             if (product) expectedTotalAmount += (product.mrp * item.quantity);
        }

        if (paymentDetails.amount !== expectedTotalAmount * 100) return res.status(400).json({ success: false, message: "Payment amount mismatch!" });

        const user = await User.findById(customerId);
        const deliveryAddress = user.addresses.id(addressId);
        if (!deliveryAddress) return res.status(400).json({ success: false, message: "Delivery address not found" });

        const vendorOrders = {}; 
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const vendorId = product.vendorId.toString();
            if (!vendorOrders[vendorId]) {
                vendorOrders[vendorId] = { vendorId: vendorId, totalAmount: 0, items: [] };
            }

            vendorOrders[vendorId].items.push({
                productId: product._id,
                productName: product.name,
                productImage: product.images[0] || '',
                priceAtPurchase: product.mrp,
                quantity: item.quantity
            });
            vendorOrders[vendorId].totalAmount += (product.mrp * item.quantity);

            await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
        }

        const orderPromises = Object.values(vendorOrders).map(async (vendorOrderData) => {
            const newOrder = new Order({
                customerId: customerId,
                vendorId: vendorOrderData.vendorId,
                items: vendorOrderData.items,
                totalAmount: vendorOrderData.totalAmount,
                deliveryAddress: {
                    name: deliveryAddress.name, phone: deliveryAddress.phone, addressLine: deliveryAddress.addressLine,
                    city: deliveryAddress.city, state: deliveryAddress.state, pin: deliveryAddress.pin, location: deliveryAddress.location
                },
                paymentMethod: 'online',
                paymentStatus: 'Completed',
                orderStatus: 'Processing',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id
            });
            
            let wallet = await VendorWallet.findOne({ vendorId: vendorOrderData.vendorId });
            if (!wallet) wallet = await VendorWallet.create({ vendorId: vendorOrderData.vendorId });
            wallet.pendingBalance += vendorOrderData.totalAmount;
            await wallet.save();

            await Vendor.findByIdAndUpdate(vendorOrderData.vendorId, {
                $inc: { totalSales: 1 } 
            });

            return newOrder.save();
        });

        await Promise.all(orderPromises);

        const purchasedProductIds = items.map(item => item.productId.toString());
        await User.findByIdAndUpdate(customerId, { $pull: { cart: { productId: { $in: purchasedProductIds } } } });

        res.status(200).json({ success: true, message: "Payment verified and order placed successfully!" });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ success: false, message: "Server Error during payment verification" });
    }
};