const express = require('express');
const router = express.Router();
const { registerVendor, loginVendor, } = require('../../controllers/vendor/vendorController');
const { getVendorLocation, updateVendorLocation ,deleteVendorAccount , getVendorSubscription ,getBankDetails ,updateBankDetails} = require('../../controllers/vendor/vendorProfileController');
const { getPersonalInfo , updatePersonalInfo , updatePassword , getStorefrontInfo, updateStorefrontInfo ,checkPlanEligibility} = require('../../controllers/vendor/vendorProfileController');
const auth = require('../../midddleware/authMiddleware');
const { authorizeRole, authorizeOwner } = require('../../midddleware/authorizeMiddleware');
const upload = require('../../midddleware/uploadMiddleware');
const { createSubscriptionOrder, verifyPayment } = require('../../controllers/vendor/paymentController');
const vendorOrderController = require('../../controllers/vendor/vendorOrderController');
const vendorWalletController = require('../../controllers/vendor/vendorWalletController');
const {getDashboardAnalytics} = require('../../controllers/vendor/vendorAnalyticsController');


const { 
    addProduct, 
    getVendorInventory, 
    getSingleProduct, 
    updateProduct, 
    updateStock, 
    deleteProduct 
} = require('../../controllers/vendor/productController');

router.post('/register', registerVendor);
router.post('/login', loginVendor);

router.get('/profile/location', auth, authorizeRole('vendor'), getVendorLocation);
router.put('/profile/location', auth, authorizeRole('vendor'), updateVendorLocation);
router.get('/profile/personal', auth, authorizeRole('vendor'), getPersonalInfo);
router.put('/profile/personal', auth, authorizeRole('vendor'), updatePersonalInfo);
router.put('/profile/password', auth, authorizeRole('vendor'), updatePassword);
router.get('/profile/storefront', auth, authorizeRole('vendor'), getStorefrontInfo);
router.put('/profile/storefront', auth, authorizeRole('vendor'), updateStorefrontInfo);
router.delete('/profile/account', auth, authorizeRole('vendor'), deleteVendorAccount);
router.get('/profile/subscription', auth, authorizeRole('vendor'), getVendorSubscription);

router.post('/products/add', auth, authorizeRole('vendor'), upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), addProduct);

router.get('/products', auth, authorizeRole('vendor'), getVendorInventory);

router.get('/products/:id', auth, authorizeRole('vendor'), getSingleProduct);

router.put('/products/:id', auth, authorizeRole('vendor'), upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), updateProduct);

router.patch('/products/:id/stock', auth, authorizeRole('vendor'), updateStock);

router.delete('/products/:id', auth, authorizeRole('vendor'), deleteProduct);



router.post('/payment/create-order', auth , createSubscriptionOrder);
router.post('/payment/verify', auth , verifyPayment);





router.get('/orders', auth, authorizeRole('vendor'), vendorOrderController.getVendorOrders);

router.patch('/orders/:orderId/status', auth, authorizeRole('vendor'), vendorOrderController.updateOrderStatus);


router.get('/wallet', auth, authorizeRole('vendor'), vendorWalletController.getWalletInfo);

router.post('/wallet/withdraw', auth, authorizeRole('vendor'), vendorWalletController.requestWithdrawal);



router.get('/analytics', auth, authorizeRole('vendor'), getDashboardAnalytics);



router.get('/profile/bank', auth, authorizeRole('vendor'), getBankDetails);
router.put('/profile/bank', auth, authorizeRole('vendor'), updateBankDetails);



router.post('/profile/check-eligibility', auth, authorizeRole('vendor'), checkPlanEligibility);

module.exports = router;