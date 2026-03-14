const express = require('express');
const router = express.Router();
const authMiddleware = require('../../midddleware/authMiddleware');
const { placeOrder } = require('../../controllers/customer/orderController');

router.use(authMiddleware);

router.post('/place', placeOrder);

module.exports = router;