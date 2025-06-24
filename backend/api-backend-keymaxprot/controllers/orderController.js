const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const mercadopago = require('mercadopago');

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    
    const order = new Order({
      userId,
      items,
      total
    });

    const savedOrder = await order.save();

    // Crear preferencia de pago en MercadoPago
    const preference = {
      items: items.map(item => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      })),
      external_reference: savedOrder._id.toString(),
      back_urls: {
        success: `${process.env.FRONTEND_URL}/checkout/success`,
        failure: `${process.env.FRONTEND_URL}/checkout/failure`,
        pending: `${process.env.FRONTEND_URL}/checkout/pending`
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);

    res.status(201).json({
      order: savedOrder,
      init_point: response.body.init_point
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

// Obtener todas las órdenes de un usuario
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

// Procesar el webhook de MercadoPago
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentInfo = await mercadopago.payment.findById(data.id);
      const orderId = paymentInfo.body.external_reference;
      const status = paymentInfo.body.status;

      // Actualizar estado de la orden
      const order = await Order.findById(orderId);
      if (order) {
        order.status = status === 'approved' ? 'completed' : status;
        await order.save();

        // Crear registro de pago
        const payment = new Payment({
          orderId: order._id,
          transactionId: data.id,
          amount: paymentInfo.body.transaction_amount,
          paymentMethod: paymentInfo.body.payment_method_id,
          status: status,
          paymentDetails: {
            merchantId: paymentInfo.body.merchant_id,
            payerId: paymentInfo.body.payer.id,
            paymentTime: paymentInfo.body.date_created,
            merchantReference: orderId
          }
        });
        await payment.save();

        // Si el pago fue aprobado, generar factura
        if (status === 'approved') {
          const invoice = new Invoice({
            orderId: order._id,
            userId: order.userId,
            items: order.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity
            })),
            subtotal: order.total,
            tax: order.total * 0.19, // 19% IVA
            total: order.total * 1.19,
            paymentMethod: paymentInfo.body.payment_method_id,
            paymentStatus: 'completed'
          });
          await invoice.save();
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: 'Error al procesar el webhook' });
  }
};

// Obtener factura por ID de orden
exports.getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const invoice = await Invoice.findOne({ orderId });
    
    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
};