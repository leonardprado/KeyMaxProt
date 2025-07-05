// controllers/orderController.ts

// --- Importaciones ---
import { Request, Response, NextFunction, ParamsDictionary } from 'express'; // Tipos de Express
import mongoose from 'mongoose'; // Para mongoose.Types.ObjectId

// --- Importa Modelos e Interfaces ---
// ¡ASEGÚRATE QUE ESTAS RUTAS Y EXPORTACIONES SEAN CORRECTAS!
import { IUser } from '../models/User';       // Interfaz del usuario
import { IOrder } from '../models/Order';     // Interfaz de la orden
// ¡VERIFICA ESTA RUTA Y LA EXPORTACIÓN DE IProduct!
import { IProduct } from '../types/product'; 

// --- Utilidades y Middlewares ---
// Asegúrate que APIFeatures se exporte correctamente (ej. `export default APIFeatures;`)
import APIFeatures from '../utils/APIFeatures'; 
import asyncHandler from '../middleware/asyncHandler'; // Asegúrate que asyncHandler esté tipado y exportado
import ErrorResponse from '../utils/errorResponse'; // Asegúrate que ErrorResponse esté tipado y exportado

// --- Importa los Modelos Mongoose ---
import Order from '../models/Order';
import Product from '../models/Product'; 
import Payment from '../models/Payment'; 

// --- Interfaz extendida para Request ---
// Añade `user` y `vehicle` a la Request de Express.
// Asegúrate que `IUser` y `IVehicle` estén correctamente definidos y exportados en sus modelos.
interface AuthRequest extends Request {
    user?: IUser | null; // El usuario autenticado
    vehicle?: IVehicle;   // El vehículo adjuntado (si aplica)
}

// --- Controladores ---

// --- createOrder ---
exports.createOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Comprobación explícita de req.user
  if (!req.user) {
    return next(new ErrorResponse('No autorizado para crear órdenes. Usuario no autenticado.', 401));
  }

  // Tipado explícito para req.body
  const { items } = req.body as { items: Array<{ product_id: string; quantity: number }> };

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new ErrorResponse('No se proporcionaron ítems válidos para la orden', 400));
  }

  let totalAmount = 0;
  const orderItems: Array<{ product_id: mongoose.Types.ObjectId; quantity: number; price: number }> = [];

  for (const item of items) {
    if (!item.product_id || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return next(new ErrorResponse('Datos de ítem inválidos.', 400));
    }

    // `Product.findById` debería devolver `IProduct | null`.
    const product = await Product.findById(item.product_id);

    if (!product) {
      return next(new ErrorResponse(`Producto no encontrado con id ${item.product_id}`, 404));
    }

    // `product.stock` debería ser de tipo `number` según `IProduct`.
    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`No hay suficiente stock para el producto ${product.name || product._id}. Stock actual: ${product.stock}`, 400));
    }

    totalAmount += product.price * item.quantity;
    orderItems.push({
      product_id: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    product.stock -= item.quantity;
    await product.save();
  }

  // `Order.create` debe usar el modelo `Order` tipado con `IOrder`.
  const order = await Order.create({
    user: req.user.id, // `req.user.id` debería ser el `_id` del usuario autenticado
    products: orderItems,
    totalPrice: totalAmount,
    status: 'pending',
  });

  await Payment.create({
    order_id: order._id,
    user_id: req.user.id,
    amount: totalAmount,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ErrorResponse('No autorizado para ver tus órdenes.', 401));
  }

  // `Order.find()` debería devolver `IOrder[]`. `populate` requiere que los campos referenciados estén tipados.
  // Asegúrate que `IProduct` tenga `name` y `price` si los usas en `select`.
  // `APIFeatures` debe estar correctamente tipado y exportado.
  // --- ¡CORRECCIÓN CLAVE! ---
  // `APIFeatures` debe tener una propiedad `query` que sea la consulta Mongoose tipada.
  // Si `APIFeatures` devuelve la consulta directamente, entonces `features.query` es correcto.
  // Si `APIFeatures` tiene un método para ejecutar la consulta, ese sería el que llamar.
  // Asumiendo que `features.query` es la forma correcta de obtener la consulta Mongoose.
  const features = new APIFeatures(Order.find({ user: req.user.id }).populate(
    'products.product',
    'name price' 
  ), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // --- ¡CORRECCIÓN CLAVE! ---
  // Si `features.query` es la consulta Mongoose, entonces la llamada correcta es `await features.query.exec()`
  // o simplemente `await features.query` si `APIFeatures` ya devuelve una Query Mongoose.
  // Asumimos que `features.query` es una Query Mongoose que se puede ejecutar.
  const orders = await features.query; // Si esto sigue dando error, revisa la clase `APIFeatures`

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/Admin
exports.getOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // `req.params.id` es el ID de la orden. `req.user` es el usuario autenticado.
  // `req.params` debería ser reconocido como `ParamsDictionary` gracias a la importación de Express.

  // `Order.findById` debería devolver `IOrder | null`.
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Orden no encontrada con el id ${req.params.id}`, 404));
  }

  // --- Verificación de Autorización ---
  // `order.user` es `mongoose.Types.ObjectId`. `req.user!.id` es string. Comparamos `toString()`.
  // `req.user!.role` debe existir y ser del tipo correcto en `IUser`.
  if (order.user.toString() !== req.user!.id && req.user!.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Usuario ${req.user.id} no está autorizado para ver esta orden`, 
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});