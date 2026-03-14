const Product = require('../../models/vendor/Product');
const Vendor = require('../../models/vendor/Vendor'); 


const getActiveVendorIds = async () => {
    const now = new Date();
    const vendors = await Vendor.find({}).select('subscription totalProducts _id');
    const activeIds = [];

    vendors.forEach(v => {
        if (!v.subscription) return;
        const sub = v.subscription;

        if (sub.planId === 'free') {
            if (v.totalProducts <= sub.productLimit) activeIds.push(v._id);
        } else {
            if (sub.endDate && new Date(sub.endDate) > now && v.totalProducts <= sub.productLimit) {
                activeIds.push(v._id);
            }
        }
    });
    return activeIds;
};

exports.getHomeProducts = async (req, res) => {
    try {
        const { lng, lat } = req.query;
        const activeVendorIds = await getActiveVendorIds(); 

        if (activeVendorIds.length === 0) return res.status(200).json({ success: true, count: 0, data: [] });

        if (lng && lat) {
            const longitude = parseFloat(lng);
            const latitude = parseFloat(lat);

            const nearbyVendors = await Vendor.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [longitude, latitude] },
                        distanceField: "distance",
                        maxDistance: 20000, 
                        spherical: true,
                        query: { _id: { $in: activeVendorIds } } 
                    }
                }
            ]);

            if (nearbyVendors.length === 0) return res.status(200).json({ success: true, count: 0, data: [] });

            const vendorMap = {};
            const vendorIds = nearbyVendors.map(v => {
                vendorMap[v._id.toString()] = v;
                return v._id;
            });

            const products = await Product.find({ vendorId: { $in: vendorIds }, status: 'Active' }).lean();

            const formattedProducts = products.map(p => {
                const vInfo = vendorMap[p.vendorId.toString()];
                return {
                    ...p,
                    distance: vInfo.distance,
                    vendorId: {
                        _id: vInfo._id,
                        companyName: vInfo.companyName,
                        city: vInfo.shopAddress?.city
                    }
                };
            });

            formattedProducts.sort((a, b) => a.distance - b.distance);
            return res.status(200).json({ success: true, count: formattedProducts.length, data: formattedProducts });
        }

        const products = await Product.find({ 
            status: 'Active', 
            vendorId: { $in: activeVendorIds } 
        }).sort({ createdAt: -1 }).populate('vendorId', 'companyName city');
        
        res.status(200).json({ success: true, count: products.length, data: products });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
};

exports.getSingleProductCustomer = async (req, res) => {
    try {
        const activeVendorIds = await getActiveVendorIds(); 
        const product = await Product.findOne({ 
            _id: req.params.id, 
            status: 'Active',
            vendorId: { $in: activeVendorIds } // 🛑 Secure
        }).populate('vendorId', 'companyName ownerName shopAddress rating totalSales'); 

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or inactive" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query; 
        const activeVendorIds = await getActiveVendorIds(); 
        
        let filter = { status: 'Active', vendorId: { $in: activeVendorIds } }; // 🛑 Secure

        if (category && category !== 'All') {
            filter.category = new RegExp('^' + category + '$', 'i');
        }
        
        const products = await Product.find(filter)
            .populate('vendorId', 'companyName ownerName shopAddress rating city')
            .sort({ createdAt: -1 }); 

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getCartRelatedProducts = async (req, res) => {
    try {
        const activeVendorIds = await getActiveVendorIds(); 
        const filter = { status: 'Active', isBargainable: false, vendorId: { $in: activeVendorIds } }; // 🛑 Secure

        const products = await Product.find(filter)
            .populate('vendorId', 'companyName city') 
            .sort({ createdAt: -1 })
            .limit(10); 

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { q, lng, lat, type } = req.query; 

        if (!q || q.trim() === "") return res.status(400).json({ success: false, message: "Search query is required" });

        const searchQuery = q.trim();
        const activeVendorIds = await getActiveVendorIds(); 
        let products = [];
        
        if (activeVendorIds.length === 0) return res.status(200).json({ success: true, data: { exact: [], related: [] } });
        
        if (type === 'nearby' && lng && lat) {
             const longitude = parseFloat(lng);
             const latitude = parseFloat(lat);

             const nearbyVendors = await Vendor.aggregate([
                 {
                     $geoNear: {
                         near: { type: "Point", coordinates: [longitude, latitude] },
                         distanceField: "distance",
                         maxDistance: 20000, 
                         spherical: true,
                         query: { _id: { $in: activeVendorIds } } 
                     }
                 },
                 { $project: { _id: 1, distance: 1, companyName: 1, "shopAddress.city": 1 } }
             ]);

             if (nearbyVendors.length > 0) {
                 const vendorMap = {};
                 const vendorIds = nearbyVendors.map(v => { vendorMap[v._id.toString()] = v; return v._id; });

                 const regex = new RegExp(searchQuery, 'i');
                 const nearbyProducts = await Product.find({
                     vendorId: { $in: vendorIds }, status: 'Active',
                     $or: [ { name: regex }, { category: regex }, { tags: regex }, { description: regex } ]
                 }).lean();

                 products = nearbyProducts.map(p => {
                     const vInfo = vendorMap[p.vendorId.toString()];
                     return { ...p, distance: vInfo.distance, vendorId: { _id: vInfo._id, companyName: vInfo.companyName, city: vInfo.shopAddress?.city } };
                 });

                 products.sort((a, b) => a.distance - b.distance);
             }
        } 
        
        if(products.length === 0) { 
            products = await Product.find(
                { status: 'Active', vendorId: { $in: activeVendorIds }, $text: { $search: searchQuery } },
                { score: { $meta: "textScore" } }
            ).populate('vendorId', 'companyName city').sort({ score: { $meta: "textScore" } }).limit(30);

            if (products.length === 0) {
                const regex = new RegExp(searchQuery, 'i');
                products = await Product.find({
                    status: 'Active', vendorId: { $in: activeVendorIds },
                    $or: [ { name: regex }, { category: regex }, { tags: regex }, { description: regex } ]
                }).populate('vendorId', 'companyName city').sort({ createdAt: -1 }).limit(30);
            }
        }

        let relatedProducts = [];
        if (products.length > 0) {
            const exactIds = products.map(p => p._id);
            const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
            
            relatedProducts = await Product.find({
                status: 'Active', vendorId: { $in: activeVendorIds }, category: { $in: categories }, _id: { $nin: exactIds }
            }).populate('vendorId', 'companyName city').limit(10);
        } else {
            relatedProducts = await Product.find({ status: 'Active', vendorId: { $in: activeVendorIds } })
                .populate('vendorId', 'companyName city').sort({ createdAt: -1 }).limit(10);
        }

        res.status(200).json({ success: true, data: { exact: products, related: relatedProducts } });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error during search" });
    }
};