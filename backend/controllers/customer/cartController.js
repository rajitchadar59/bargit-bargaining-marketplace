const User = require('../../models/User');
const Product = require('../../models/vendor/Product');

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'cart.productId',
            select: 'name mrp images stock specifications isBargainable vendorId status' 
        });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const validCart = user.cart.filter(item => item.productId && item.productId.status === 'Active'); 
        
        res.status(200).json({ success: true, cart: validCart });
    } catch (error) {
        console.error("Cart Fetch Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const user = await User.findById(req.userId);

        const product = await Product.findById(productId);
        
        if (!product || product.status !== 'Active' || product.stock < 1) {
            return res.status(400).json({ success: false, message: "Product not available or out of stock" });
        }

        const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex > -1) {
            let newQty = user.cart[existingItemIndex].quantity + quantity;
            if (newQty > product.stock) newQty = product.stock; 
            user.cart[existingItemIndex].quantity = newQty;
        } else {
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.status(200).json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Add Cart Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateCartQty = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.userId);
        const product = await Product.findById(productId);

        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: `Only ${product.stock} available` });
        }

        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity = Math.max(1, quantity); 
            await user.save();
        }

        res.status(200).json({ success: true, message: "Quantity updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.userId);

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();

        res.status(200).json({ success: true, message: "Item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};