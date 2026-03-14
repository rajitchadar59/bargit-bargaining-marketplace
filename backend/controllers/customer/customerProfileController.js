const User = require('../../models/User'); 
const bcrypt = require('bcryptjs');
const getCoordinates = require('../../utils/geocode');
const Order = require('../../models/Order');
const Product = require('../../models/vendor/Product');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, phone } = req.body;
        if (!username) return res.status(400).json({ success: false, message: 'Name is required' });

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, phone },
            { returnDocument: 'after', runValidators: true }
        ).select('-password');

        res.status(200).json({ success: true, message: 'Profile updated!', data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};



exports.addAddress = async (req, res) => {
    try {
        let { type, name, phone, addressLine, city, state, pin, isDefault } = req.body;

        const fullAddressStr = `${addressLine}, ${city}, ${state}, ${pin}`;
        const coords = await getCoordinates(fullAddressStr);

        if (!coords) return res.status(400).json({ success: false, message: "Invalid address. Cannot find on map." });

        const user = await User.findById(req.user.id);

        if (user.addresses.length === 0) {
            isDefault = true;
        }

        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        const newAddress = {
            type, name, phone, addressLine, city, state, pin, isDefault,
            location: { type: "Point", coordinates: coords }
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(200).json({ success: true, message: 'Address added!', data: user.addresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error adding address' });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const addressToDelete = user.addresses.id(req.params.addressId);
        if (!addressToDelete) return res.status(404).json({ success: false, message: 'Address not found' });

        const wasDefault = addressToDelete.isDefault;

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.status(200).json({ success: true, message: 'Address removed!', data: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting address' });
    }
};


exports.setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });

        const targetAddress = user.addresses.id(addressId);
        if (!targetAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        
        targetAddress.isDefault = true;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Default address updated!', 
            data: user.addresses 
        });
    } catch (error) {
        console.error("Set Default Address Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching orders' });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'wishlist',
            select: 'name mrp images isBargainable status stock'
        });
        
        const activeWishlist = user.wishlist.filter(item => item && item.status === 'Active');
        
        res.status(200).json({ success: true, data: activeWishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching wishlist' });
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);

        const index = user.wishlist.indexOf(productId);
        let message = '';

        if (index === -1) {
            user.wishlist.push(productId);
            message = 'Added to wishlist';
        } else {
            user.wishlist.splice(index, 1);
            message = 'Removed from wishlist';
        }

        await user.save();
        res.status(200).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error updating wishlist' });
    }
};