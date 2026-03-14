const express = require('express');
const router = express.Router();
const { getHomeProducts , getSingleProductCustomer , getProductsByCategory , getCartRelatedProducts ,searchProducts} = require('../../controllers/customer/customerProductController');

router.get('/products/search',searchProducts);

router.get('/products', getHomeProducts);

router.get('/products/:id', getSingleProductCustomer);

router.get('/category-products', getProductsByCategory);

router.get('/cart-related', getCartRelatedProducts);

module.exports = router;