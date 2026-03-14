const Product = require('../../models/vendor/Product'); 
const Vendor = require('../../models/vendor/Vendor'); 

exports.addProduct = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id);
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const sub = vendor.subscription;
        const now = new Date();

        if (sub.planId !== 'free' && sub.endDate && sub.endDate < now) {
            return res.status(403).json({ 
                success: false, 
                message: 'Your subscription has expired. Please renew your plan to add products.' 
            });
        }

      
        const actualProductCount = await Product.countDocuments({ vendorId: req.user.id });

        if (actualProductCount >= sub.productLimit) {
            return res.status(403).json({ 
                success: false, 
                message: `Product limit reached! You have used ${actualProductCount}/${sub.productLimit} slots.` 
            });
        }

        let {
            name, description, category, customCategory,
            mrp, isBargainable, minBargainPrice, stock, sku, status,
            tags, specifications
        } = req.body;

        const finalCategory = category === 'Others' ? customCategory : category;

        let parsedTags = [];
        let parsedSpecs = [];
        try {
            if (tags && typeof tags === 'string') parsedTags = JSON.parse(tags);
            else if (Array.isArray(tags)) parsedTags = tags;

            if (specifications && typeof specifications === 'string') parsedSpecs = JSON.parse(specifications);
            else if (Array.isArray(specifications)) parsedSpecs = specifications;
        } catch (err) {
            console.error("JSON Parse Error:", err.message);
        }

        let imageUrls = [];
        let videoUrl = null;

        if (req.files && req.files['images']) {
            imageUrls = req.files['images'].map(file => file.path); 
        }
        if (req.files && req.files['video']) {
            videoUrl = req.files['video'][0].path;
        }

        if (imageUrls.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one product image is required.' });
        }

        const newProduct = new Product({
            vendorId: req.user.id,
            name, description, category: finalCategory,
            tags: parsedTags, specifications: parsedSpecs,
            mrp: Number(mrp),
            isBargainable: isBargainable === 'true', 
            minBargainPrice: minBargainPrice ? Number(minBargainPrice) : undefined,
            stock: Number(stock), sku: sku || undefined,
            images: imageUrls, video: videoUrl,   
            status: status || 'Active'
        });

        await newProduct.save();

        vendor.totalProducts = actualProductCount + 1;
        await vendor.save();

        res.status(201).json({ success: true, message: 'Product added successfully!', data: newProduct });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({ success: false, message: error.message || 'Server error while adding product.' });
    }
};


exports.getVendorInventory = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const products = await Product.find({ vendorId }).sort({ createdAt: -1 });
        
        const totalProducts = products.length;
        const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStockCount = products.filter(p => p.stock === 0).length;

        res.status(200).json({
            success: true,
            stats: { totalProducts, lowStockCount, outOfStockCount },
            data: products
        });
    } catch (error) {
        console.error("Get Inventory Error:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching inventory.' });
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, vendorId: req.user.id });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
        
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Get Single Product Error:", error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findOne({ _id: req.params.id, vendorId: req.user.id });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

        let {
            name, description, category, customCategory,
            mrp, isBargainable, minBargainPrice, stock, sku, status,
            tags, specifications, existingImages 
        } = req.body;

        const finalCategory = category === 'Others' ? customCategory : category;

        let parsedTags = []; let parsedSpecs = []; let parsedExistingImages = [];
        try {
            if (tags && typeof tags === 'string') parsedTags = JSON.parse(tags);
            else if (Array.isArray(tags)) parsedTags = tags;

            if (specifications && typeof specifications === 'string') parsedSpecs = JSON.parse(specifications);
            else if (Array.isArray(specifications)) parsedSpecs = specifications;

            if (existingImages && typeof existingImages === 'string') parsedExistingImages = JSON.parse(existingImages);
            else if (Array.isArray(existingImages)) parsedExistingImages = existingImages;
        } catch (err) {}

        let newImageUrls = [...parsedExistingImages]; 
        let videoUrl = product.video; 

        if (req.files && req.files['images']) {
            newImageUrls = [...newImageUrls, ...req.files['images'].map(file => file.path)];
        }
        if (req.files && req.files['video']) {
            videoUrl = req.files['video'][0].path;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.category = finalCategory || product.category;
        product.tags = parsedTags;
        product.specifications = parsedSpecs;
        product.mrp = mrp ? Number(mrp) : product.mrp;
        product.isBargainable = isBargainable === 'true';
        product.minBargainPrice = product.isBargainable ? (minBargainPrice ? Number(minBargainPrice) : undefined) : undefined;
        product.stock = stock ? Number(stock) : product.stock;
        product.sku = sku || product.sku;
        product.status = status || product.status;
        product.images = newImageUrls;
        product.video = videoUrl;

        await product.save();
        res.status(200).json({ success: true, message: 'Product updated successfully!', data: product });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ success: false, message: 'Server error while updating product.' });
    }
};


exports.updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        if (stock < 0) return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, vendorId: req.user.id },
            { stock: Number(stock) },
            { new: true } 
        );

        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

        res.status(200).json({ success: true, message: 'Stock updated successfully.', data: product });
    } catch (error) {
        console.error("Update Stock Error:", error);
        res.status(500).json({ success: false, message: 'Server error while updating stock.' });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found or unauthorized.' });
        }

        await Vendor.findByIdAndUpdate(req.user.id, {
            $inc: { totalProducts: -1 }
        });

        res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ success: false, message: 'Server error while deleting product.' });
    }
};