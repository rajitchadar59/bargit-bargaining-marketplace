const Razorpay = require('razorpay');
const crypto = require('crypto');
const Vendor = require('../../models/vendor/Vendor');
const Product = require('../../models/vendor/Product'); 

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createSubscriptionOrder = async (req, res) => {
    try {
        const { amount, planId, planName, days, productLimit } = req.body;
        
        const vendor = await Vendor.findById(req.user.id).select('totalProducts');
        if (vendor.totalProducts > productLimit) {
            return res.status(400).json({ 
                success: false, 
                message: `Payment Blocked! Your products (${vendor.totalProducts}) exceed this plan limit (${productLimit}).` 
            });
        }

        const options = { amount: amount * 100, currency: "INR", receipt: `rcpt_${Date.now()}` };
        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true, order, key_id: process.env.RAZORPAY_KEY_ID,
            tempData: { planId, planName, days, productLimit, amount } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not initiate payment' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planData } = req.body;
        const vendorId = req.user.id; 

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");
        if (razorpay_signature !== expectedSign) return res.status(400).json({ success: false, message: "Invalid signature!" });

        const vendor = await Vendor.findById(vendorId);
        const { planId, planName } = planData;
        const parsedProductLimit = Number(planData.productLimit) || 0;

        if (vendor.totalProducts > parsedProductLimit) {
            return res.status(400).json({ 
                success: false, 
                message: "Verification Failed! Products exceed plan limit. Delete items to activate." 
            });
        }

        const now = new Date();
        const currentSub = vendor.subscription;
        let newEndDate = null;
        let finalProductLimit = parsedProductLimit;
        const isPaidPlanActive = currentSub.status === 'active' && currentSub.planId !== 'free' && currentSub.endDate > now;

        if (Number(planData.days) < 99999) {
            let extraDays = Number(planData.days);
            if (isPaidPlanActive) {
                const remainingDays = Math.ceil((currentSub.endDate - now) / (1000 * 60 * 60 * 24));
                extraDays += remainingDays;
            }
            newEndDate = new Date(now.setDate(now.getDate() + extraDays));
        }

        if (parsedProductLimit >= 99999) {
            finalProductLimit = 99999;
        } else if (isPaidPlanActive) {
            finalProductLimit = Number(currentSub.productLimit) + parsedProductLimit;
        }

        await Vendor.findByIdAndUpdate(vendorId, {
            $set: {
                "subscription.planId": planId,
                "subscription.planName": planName,
                "subscription.status": "active",
                "subscription.endDate": newEndDate,
                "subscription.productLimit": finalProductLimit,
                "subscription.razorpayOrderId": razorpay_order_id,
                "subscription.razorpayPaymentId": razorpay_payment_id,
                "subscription.lastPaymentAmount": planData.amount,
                "subscription.lastPaymentDate": new Date()
            }
        });

        res.status(200).json({ success: true, message: "Plan Upgraded!" });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};