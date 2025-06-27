const express = require('express');
const router = express.Router();
const { createService, getServices } = require('../controllers/serviceCatalogController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Protect and authorize routes as needed
router.route('/').post(protect, authorize(['admin']), createService).get(getServices);

module.exports = router;