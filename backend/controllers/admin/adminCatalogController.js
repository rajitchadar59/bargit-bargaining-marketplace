const Product = require('../../models/vendor/Product');
const ProductTrash = require('../../models/admin/ProductTrash');

exports.getAllCatalogProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('vendorId', 'companyName ownerName email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error("Catalog Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.moveToTrash = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId).populate('vendorId', 'companyName ownerName email');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        await ProductTrash.create({
            productId: product._id,
            productData: product.toObject()
        });

        await Product.findByIdAndDelete(productId);

        res.status(200).json({ success: true, message: 'Product taken down and moved to Trash.' });
    } catch (error) {
        console.error("Trash Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getTrashedProducts = async (req, res) => {
    try {
        const trashed = await ProductTrash.find().sort({ deletedAt: -1 });
        res.status(200).json({ success: true, data: trashed });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.recoverProduct = async (req, res) => {
    try {
        const trashId = req.params.id;

        const trashedItem = await ProductTrash.findById(trashId);
        if (!trashedItem) return res.status(404).json({ success: false, message: 'Not found in trash' });

        await Product.create(trashedItem.productData);
        await ProductTrash.findByIdAndDelete(trashId);

        res.status(200).json({ success: true, message: 'Product recovered successfully!' });
    } catch (error) {
        console.error("Recovery Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.permanentlyDeleteProduct = async (req, res) => {
    try {
        const trashId = req.params.id;
        await ProductTrash.findByIdAndDelete(trashId);
        res.status(200).json({ success: true, message: 'Product permanently deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};