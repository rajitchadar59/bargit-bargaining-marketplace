const VendorWallet = require('../../models/vendor/VendorWallet');
const Transaction = require('../../models/vendor/Transaction');
const Settings = require('../../models/admin/Settings'); 
const Vendor = require('../../models/vendor/Vendor'); 

exports.getWalletInfo = async (req, res) => {
    try {
        const vendorId = req.userId;
        let wallet = await VendorWallet.findOne({ vendorId });
        

        if (!wallet) {
             wallet = await VendorWallet.create({ vendorId }); 
        }

        const transactions = await Transaction.find({ vendorId }).sort({ createdAt: -1 }).limit(30);

        
        const vendorInfo = await Vendor.findById(vendorId).select('bankDetails');
        const hasBankDetails = !!(vendorInfo && vendorInfo.bankDetails && (vendorInfo.bankDetails.accountNumber || vendorInfo.bankDetails.upiId));

        res.status(200).json({ 
            success: true, 
            hasBankDetails, 
            wallet: {
                availableBalance: wallet.availableBalance,
                pendingBalance: wallet.pendingBalance, 
                lifetimeEarnings: wallet.lifetimeEarnings
            }, 
            transactions 
        });
    } catch (error) {
        console.error("Wallet Fetch Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.requestWithdrawal = async (req, res) => {
    try {
        const vendorId = req.userId;
        const { amount } = req.body;

        if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

        const settings = await Settings.findOne();
        const minPayout = settings ? settings.minPayoutThreshold : 500; 

        if (amount < minPayout) {
            return res.status(400).json({ 
                success: false, 
                message: `Minimum withdrawal amount is ₹${minPayout}`
            });
        }

        const wallet = await VendorWallet.findOne({ vendorId });
        if (!wallet || wallet.availableBalance < amount) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }

        wallet.availableBalance -= amount;
        await wallet.save();

        const withdrawalTxn = await Transaction.create({
            vendorId, 
            type: 'withdrawal', 
            amount: amount, 
            paymentMethod: 'bank_transfer',
            status: 'Processing', 
            description: 'Payout requested to Bank Account/UPI'
        });

        res.status(200).json({ success: true, message: "Withdrawal requested successfully", transaction: withdrawalTxn });
    } catch (error) {
        console.error("Withdrawal Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};