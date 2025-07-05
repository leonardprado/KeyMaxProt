// controllers/orderController.ts

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Order, { IOrderDocument } from '../models/Order';
import Product, { IProduct } from '../models/Product';
import Payment from '../models/Payment';
import { IUserDocument } from '../models/User'; // ✅ este es el cambio
import { IVehicle } from '../models/Vehicle';
import APIFeatures from '../utils/APIFeatures';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';

interface AuthRequest extends Request {
  user?: IUserDocument | null; // ✅ corregido aquí
  vehicle?: IVehicle;
}

// --- Crear Orden ---
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ErrorResponse('No autorizado para crear órdenes.', 401));
  }

  const { items } = req.body as {
    items: Array<{ product_id: string; quantity: number }>;
  };

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new ErrorResponse('No se proporcionaron ítems válidos para la orden', 400));
  }

  let totalAmount = 0;
  const orderItems: Array<{ product_id: mongoose.Types.ObjectId; quantity: number; price: number }> = [];

  for (const item of items) {
    if (!item.product_id || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return next(new ErrorResponse('Datos de ítem inválidos.', 400));
    }

    const product = await Product.findById(item.product_id) as IProduct & { _id: mongoose.Types.ObjectId };

    if (!product) {
      return next(new ErrorResponse(`Producto no encontrado con id ${item.product_id}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`No hay suficiente stock para el producto ${product.name}. Stock actual: ${product.stock}`, 400));
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

  const order = await Order.create({
    user: req.user._id as mongoose.Types.ObjectId,
    products: orderItems.map(item => ({
      product: item.product_id,
      quantity: item.quantity,
    })),
    totalPrice: totalAmount,
    status: 'pending',
  });

  await Payment.create({
    order_id: order._id,
    user_id: req.user._id as mongoose.Types.ObjectId,
    amount: totalAmount,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// --- Obtener Órdenes del Usuario ---
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ErrorResponse('No autorizado para ver tus órdenes.', 401));
  }

  const features = new APIFeatures<IOrderDocument>(
    Order.find({ user: req.user._id }).populate('products.product', 'name price'),
    req.query
  ).filter().sort().limitFields().paginate();

  const orders = await features.query;

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// --- Obtener Orden por ID ---
export const getOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Orden no encontrada con el id ${req.params.id}`, 404));
  }

  if (!req.user) {
    return next(new ErrorResponse('Usuario no autenticado', 401));
  }

  if (order.user.toString() !== String(req.user._id) && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Usuario ${req.user._id} no está autorizado para ver esta orden`, 401));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});
