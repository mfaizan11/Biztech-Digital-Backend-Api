const express = require('express');
const router = express.Router();
const db = require('../models');
const { protect } = require('../middleware/auth.middleware');

// List Projects
router.get('/', protect, async (req, res) => {
    const projects = await db.Project.findAll({ include: ['Client', 'Request'] });
    res.json(projects);
});

// Update Status (Agent)
router.patch('/:id', protect, async (req, res) => {
    await db.Project.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Project Updated" });
});

module.exports = router;