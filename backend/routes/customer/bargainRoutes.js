const express = require('express');
const router = express.Router();
const bargainController = require('../../controllers/customer/bargainController');
const authMiddleware = require('../../midddleware/authMiddleware');
const { authorizeRole } = require('../../midddleware/authorizeMiddleware');

router.post('/init', authMiddleware, bargainController.initBargain);

router.get('/status/:sessionId', authMiddleware, bargainController.getSessionStatus);

router.post('/chat', authMiddleware, bargainController.handleBargainChat);

module.exports = router;