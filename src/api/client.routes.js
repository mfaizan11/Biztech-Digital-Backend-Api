const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile } = require('../controllers/client.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/me', protect, authorize('Client'), getMyProfile);
router.put('/me', protect, authorize('Client'), updateProfile);

module.exports = router;