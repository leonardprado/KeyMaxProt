const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rutas para órdenes
router.post('/create', orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/invoice/:orderId', orderController.getInvoice);

// Webhook para notificaciones de pago de MercadoPago
router.post('/webhook', orderController.handlePaymentWebhook);

module.exports = router;