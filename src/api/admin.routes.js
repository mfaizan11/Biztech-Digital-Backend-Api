const express = require('express');
const router = express.Router();
// Import the new function
const { getPendingUsers, updateUserStatus, createCategory, getCategories, createAgent } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

// Approval Routes
router.get('/users/pending', authorize('Admin'), getPendingUsers);
router.patch('/users/:id/status', authorize('Admin'), updateUserStatus);

// Category Routes
router.post('/categories', authorize('Admin'), createCategory);
router.get('/categories', getCategories);

// --- NEW ROUTE: Create Agent ---
router.post('/agents', authorize('Admin'), createAgent);

module.exports = router;