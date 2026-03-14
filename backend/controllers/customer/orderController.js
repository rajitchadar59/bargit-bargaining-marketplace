const Order = require('../../models/Order');
const Product = require('../../models/vendor/Product');
const User = require('../../models/User');
const Vendor = require('../../models/vendor/Vendor'); 
const BargainSession = require('../../models/BargainSession');

exports.placeOrder = async (req, res) => {
    try {
        const { productId, quantity, items, paymentMethod, addressId, bargainSessionId } = req.body;
        const customerId = req.user.id;

        let itemsToProcess = [];
        if (items && items.length > 0) {
            itemsToProcess = items; 
        } else if (productId) {
            itemsToProcess = [{ productId, quantity }]; 
        } else {
            return res.status(400).json({ success: false, message: 'No products provided' });
        }

        const user = await User.findById(customerId);
        const selectedAddress = user.addresses.id(addressId);
        if (!selectedAddress) {
            return res.status(400).json({ success: false, message: 'Delivery address not found' });
        }

        const vendorOrders = {};

        for (const item of itemsToProcess) {
            const product = await Product.findById(item.productId);
            if (!product) continue;
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
            }

            let finalPrice = product.mrp; 

            if (bargainSessionId) {
                const session = await BargainSession.findOne({ 
                    _id: bargainSessionId, 
                    customerId: customerId, 
                    productId: product._id 
                });

                if (session && session.status === 'Won') {
                    if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
                        return res.status(400).json({ success: false, message: "Bargain offer expired. Please try again." });
                    }
                    finalPrice = session.agreedPrice; 
                    session.status = 'Purchased'; 
                    await session.save();
                }
            }

            const vendorId = product.vendorId.toString();

            if (!vendorOrders[vendorId]) {
                vendorOrders[vendorId] = {
                    vendorId: vendorId,
                    totalAmount: 0,
                    items: []
                };
            }

            vendorOrders[vendorId].items.push({
                productId: product._id,
                productName: product.name,
                productImage: product.images[0] || '',
                priceAtPurchase: finalPrice, 
                quantity: item.quantity
            });

            vendorOrders[vendorId].totalAmount += (finalPrice * item.quantity); 

            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        const orderPromises = Object.values(vendorOrders).map(async (vData) => {
            const newOrder = new Order({
                customerId: customerId,
                vendorId: vData.vendorId,
                items: vData.items,
                totalAmount: vData.totalAmount,
                deliveryAddress: {
                    name: selectedAddress.name,
                    phone: selectedAddress.phone,
                    addressLine: selectedAddress.addressLine,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    pin: selectedAddress.pin,
                    location: selectedAddress.location
                },
                paymentMethod: paymentMethod,
                paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Completed',
                orderStatus: 'Processing'
            });
            
            await Vendor.findByIdAndUpdate(vData.vendorId, {
                $inc: { totalSales: 1 } 
            });

            return newOrder.save();
        });

        await Promise.all(orderPromises);

        const purchasedIds = itemsToProcess.map(i => i.productId);
        await User.findByIdAndUpdate(customerId, {
            $pull: { cart: { productId: { $in: purchasedIds } } }
        });

        res.status(200).json({ 
            success: true, 
            message: 'Order placed successfully!' 
        });

    } catch (error) {
        console.error('Order Placement Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};