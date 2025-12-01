const express = require('express');
const router = express.Router();
const { createRequest, getRequests, assignRequest } = require('../controllers/request.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('Client'), createRequest);
router.get('/', protect, getRequests);
router.patch('/:id/assign', protect, authorize('Admin'), assignRequest);

module.exports = router;