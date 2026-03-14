const express = require('express');
const router = express.Router();
const authMiddleware = require('../../midddleware/authMiddleware');
const { 
    createPaymentOrder, 
    verifyPaymentAndPlaceOrder 
} = require('../../controllers/customer/customerPaymentController');

router.use(authMiddleware);

router.post('/create-order', createPaymentOrder);

router.post('/verify', verifyPaymentAndPlaceOrder);

module.exports = router;