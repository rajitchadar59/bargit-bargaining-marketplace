const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../../controllers/admin/adminAuthController');
const { getPlans, updatePlan } = require('../../controllers/admin/planController');
const authMiddleware = require('../../midddleware/authMiddleware');
const {authorizeRole} = require('../../midddleware/authorizeMiddleware');
const adminVendorController = require('../../controllers/admin/adminVendorController');
const adminCustomerController = require('../../controllers/admin/adminCustomerController');
const adminCatalogController = require('../../controllers/admin/adminCatalogController');
const adminSettingsController = require('../../controllers/admin/adminSettingsController');
const adminDashboardController = require('../../controllers/admin/adminDashboardController');


router.post('/login', loginAdmin);
router.get('/plans', authMiddleware, getPlans);
router.put('/plans/:planId', authMiddleware, updatePlan);




router.get('/vendors', authMiddleware, authorizeRole('admin'), adminVendorController.getAllVendors);
router.post('/vendors/:id/trash', authMiddleware, authorizeRole('admin'), adminVendorController.moveToTrash);

// Trash bin routes

router.get('/trash/vendors', authMiddleware, authorizeRole('admin'), adminVendorController.getTrashedVendors);
router.post('/trash/vendors/:id/recover', authMiddleware, authorizeRole('admin'), adminVendorController.recoverVendor);

router.delete('/trash/vendors/:id', authMiddleware, authorizeRole('admin'), adminVendorController.permanentlyDeleteVendor);



router.get('/customers', authMiddleware, authorizeRole('admin'), adminCustomerController.getAllCustomers);
router.post('/customers/:id/trash', authMiddleware , authorizeRole('admin'), adminCustomerController.moveToTrash);

router.get('/trash/customers', authMiddleware , authorizeRole('admin'), adminCustomerController.getTrashedCustomers);
router.post('/trash/customers/:id/recover', authMiddleware , authorizeRole('admin'), adminCustomerController.recoverCustomer);
router.delete('/trash/customers/:id', authMiddleware , authorizeRole('admin'), adminCustomerController.permanentlyDeleteCustomer);



router.get('/catalog', authMiddleware, authorizeRole('admin'), adminCatalogController.getAllCatalogProducts);
router.post('/catalog/:id/trash', authMiddleware, authorizeRole('admin'), adminCatalogController.moveToTrash);

router.get('/trash/catalog', authMiddleware, authorizeRole('admin'), adminCatalogController.getTrashedProducts);
router.post('/trash/catalog/:id/recover', authMiddleware, authorizeRole('admin'), adminCatalogController.recoverProduct);
router.delete('/trash/catalog/:id', authMiddleware, authorizeRole('admin'), adminCatalogController.permanentlyDeleteProduct);





router.get('/settings', authMiddleware , authorizeRole('admin'), adminSettingsController.getSettings);
router.post('/settings', authMiddleware  , authorizeRole('admin'), adminSettingsController.updateSettings);



router.get('/dashboard/stats', authMiddleware, authorizeRole('admin'), adminDashboardController.getDashboardStats);



module.exports = router;