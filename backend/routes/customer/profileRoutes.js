const express = require('express');
const router = express.Router();
const authMiddleware = require('../../midddleware/authMiddleware'); 
const { getProfile, updateProfile, addAddress, deleteAddress , setDefaultAddress ,getMyOrders ,getWishlist ,toggleWishlist} = require('../../controllers/customer/customerProfileController');

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/update', updateProfile);

router.post('/address', addAddress);
router.delete('/address/:addressId', deleteAddress);

router.put('/address/:addressId/default', setDefaultAddress);


router.get('/orders', getMyOrders);
router.get('/wishlist',getWishlist);
router.post('/wishlist/toggle',toggleWishlist);

module.exports = router;