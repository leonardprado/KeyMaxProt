const express = require('express');
const router = express.Router();
const { createService, getServices, getService, updateService, deleteService } = require('../controllers/serviceCatalogController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Protect and authorize routes as needed
router.route('/').post(protect, authorize(['admin']), createService).get(getServices);
router.route('/categories').get(getServiceCategories);
router.route('/:id').get(getService).put(protect, authorize(['admin']), updateService).delete(protect, authorize(['admin']), deleteService);

module.exports = router;