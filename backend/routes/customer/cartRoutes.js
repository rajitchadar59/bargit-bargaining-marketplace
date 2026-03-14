const express = require('express');
const router = express.Router();
const authMiddleware = require('../../midddleware/authMiddleware');
const { getCart, addToCart, updateCartQty, removeFromCart } = require('../../controllers/customer/cartController');

router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartQty);
router.delete('/remove/:productId', removeFromCart);

module.exports = router;