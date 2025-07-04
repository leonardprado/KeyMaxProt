import { Request, Response, NextFunction } from 'express';
const ErrorResponse = require('../utils/errorResponse'); 
 
 const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => { 
   let error = { ...err }; 
   error.message = err.message; 
 
   // Log to console for dev 
   console.log(err.stack.red); // Puedes usar el paquete 'colors' para esto 
 
   // Mongoose bad ObjectId 
   if (err.name === 'CastError') { 
     const message = `Recurso no encontrado con el id ${err.value}`; 
     error = new ErrorResponse(message, 404); 
   } 
 
   // Mongoose duplicate key 
   if (err.code === 11000) { 
     const message = 'Valor de campo duplicado ingresado'; 
     error = new ErrorResponse(message, 400); 
   } 
 
   // Mongoose validation error 
   if (err.name === 'ValidationError') { 
     const message = Object.values(err.errors).map((val: any) => val.message).join(', '); 
     error = new ErrorResponse(message, 400); 
   } 
 
   res.status(error.statusCode || 500).json({ 
     success: false, 
     error: error.message || 'Error del Servidor' 
   }); 
 }; 
 
 export default errorHandler;