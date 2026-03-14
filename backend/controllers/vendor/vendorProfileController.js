const Vendor = require('../../models/vendor/Vendor');
const getCoordinates = require('../../utils/geocode'); 
const bcrypt = require('bcryptjs');
const Plan = require('../../models/admin/Plan'); 


exports.checkPlanEligibility = async (req, res) => {
    try {
        const { targetPlanLimit } = req.body; 
        const vendorId = req.user.id;

        const vendor = await Vendor.findById(vendorId).select('totalProducts');
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        if (vendor.totalProducts > targetPlanLimit) {
            return res.status(400).json({ 
                success: false, 
                message: `Upgrade Blocked! DB says you have ${vendor.totalProducts} products, but this plan only allows ${targetPlanLimit}.` 
            });
        }

        res.status(200).json({ success: true, message: 'Eligible to upgrade!' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getVendorLocation = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id).select('shopAddress');
        
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        res.status(200).json({
            success: true,
            data: vendor.shopAddress || {} 
        });
    } catch (error) {
        console.error("Get Location Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.updateVendorLocation = async (req, res) => {
    try {
        const vendorId = req.user.id; 
        const { street, city, state, pincode } = req.body;

        if (!city || !state) {
            return res.status(400).json({ success: false, message: "City and State are required!" });
        }

        const fullAddress = `${street ? street + ', ' : ''}${city}, ${state}, ${pincode ? pincode : ''}`;
        const coords = await getCoordinates(fullAddress);

        if (!coords) {
            return res.status(400).json({ success: false, message: "Invalid address. Cannot find on map." });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            {
                $set: {
                    "shopAddress.street": street,
                    "shopAddress.city": city,
                    "shopAddress.state": state,
                    "shopAddress.pincode": pincode,
                    "shopAddress.location": {
                        type: "Point",
                        coordinates: coords
                    }
                }
            },
            { returnDocument: 'after', runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Location updated successfully!",
            data: updatedVendor.shopAddress
        });

    } catch (error) {
        console.error("Update Location Error:", error);
        res.status(500).json({ success: false, message: "Server error while updating location." });
    }
};



exports.getPersonalInfo = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id).select('ownerName email phoneNumber');
        
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching info' });
    }
};

exports.updatePersonalInfo = async (req, res) => {
    try {
        const { ownerName, phoneNumber } = req.body;

        if (!ownerName || !phoneNumber) {
            return res.status(400).json({ success: false, message: 'Name and Phone number are required' });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.user.id, 
            { ownerName, phoneNumber },
            { returnDocument: 'after', runValidators: true } 
        ).select('ownerName email phoneNumber');

        res.status(200).json({ 
            success: true, 
            message: 'Personal info updated successfully!', 
            data: updatedVendor 
        });
    } catch (error) {
        console.error('Error updating personal info:', error);
        res.status(500).json({ success: false, message: 'Failed to update info' });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both passwords' });
        }

        if (newPassword.length < 6) {
             return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const vendor = await Vendor.findById(req.user.id); 
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        vendor.password = await bcrypt.hash(newPassword, salt);
        await vendor.save();

        res.status(200).json({ success: true, message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Failed to update password' });
    }
};


exports.getStorefrontInfo = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id).select('companyName businessType category description');
        
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        console.error('Error fetching storefront info:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching info' });
    }
};


exports.updateStorefrontInfo = async (req, res) => {
    try {
        const { companyName, businessType, category, description } = req.body;

        if (!companyName || !businessType || !category) {
            return res.status(400).json({ success: false, message: 'Company Name, Business Type, and Category are required.' });
        }

        const existingCompany = await Vendor.findOne({ companyName, _id: { $ne: req.user.id } });
        if (existingCompany) {
            return res.status(400).json({ success: false, message: 'This Company Name is already taken by another vendor.' });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.user.id,
            { companyName, businessType, category, description },
            { returnDocument: 'after', runValidators: true }
        ).select('companyName businessType category description');

        res.status(200).json({ 
            success: true, 
            message: 'Storefront details updated successfully!', 
            data: updatedVendor 
        });

    } catch (error) {
        console.error('Error updating storefront info:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'This Company Name is already registered.' });
        }

        res.status(500).json({ success: false, message: 'Failed to update storefront info' });
    }
};







exports.deleteVendorAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required to delete the account.' });
        }

        const vendor = await Vendor.findById(req.user.id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found.' });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password. Account deletion failed.' });
        }

        await Vendor.findByIdAndDelete(req.user.id);


        res.status(200).json({ success: true, message: 'Vendor account deleted successfully.' });

    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting account.' });
    }
};




exports.getVendorSubscription = async (req, res) => {
    try {
        const vendorId = req.user.id; 
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                subscription: vendor.subscription,
                totalProducts: vendor.totalProducts || 0
            }
        });
    } catch (error) {
        console.error("Fetch Subscription Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching subscription" });
    }
};







exports.getBankDetails = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id).select('bankDetails');
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
        
        res.status(200).json({ success: true, data: vendor.bankDetails || {} });
    } catch (error) {
        console.error("Get Bank Details Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching bank details' });
    }
};

exports.updateBankDetails = async (req, res) => {
    try {
        const { accountHolderName, accountNumber, ifscCode, bankName, upiId } = req.body;

        if (!upiId && (!accountHolderName || !accountNumber || !ifscCode || !bankName)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide either complete Bank Details or a UPI ID for payouts.' 
            });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    'bankDetails.accountHolderName': accountHolderName,
                    'bankDetails.accountNumber': accountNumber,
                    'bankDetails.ifscCode': ifscCode,
                    'bankDetails.bankName': bankName,
                    'bankDetails.upiId': upiId
                } 
            },
            { returnDocument: 'after', runValidators: true }
        ).select('bankDetails');

        res.status(200).json({ 
            success: true, 
            message: 'Payout details saved successfully!', 
            data: updatedVendor.bankDetails 
        });
    } catch (error) {
        console.error("Update Bank Details Error:", error);
        res.status(500).json({ success: false, message: 'Failed to update payout details' });
    }
};