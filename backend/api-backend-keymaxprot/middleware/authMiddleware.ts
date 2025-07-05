// middleware/authMiddleware.ts

import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler'; // Asegúrate que asyncHandler esté tipado correctamente
import ErrorResponse from '../utils/errorResponse'; // Asegúrate que ErrorResponse esté tipado correctamente

// --- Importaciones Correctas ---
// Importa Mongoose y sus tipos necesarios
import mongoose, { Schema, Document, Model, Types } from 'mongoose'; 
// Importa los tipos de Express por separado
import { Request, Response, NextFunction, RequestHandler } from 'express'; 
// Importa tus modelos y sus interfaces
import User, { IUser } from '../models/User'; 
import Vehicle, { IVehicle } from '../models/Vehicle'; 

// --- Definición de la Interfaz `AuthRequest` ---
// Extiende la Request de Express y añade nuestras propiedades personalizadas.
interface AuthRequest extends Request {
    user?: IUser | null; // El usuario autenticado
    vehicle?: IVehicle;   // El vehículo adjuntado
    // Si necesitas `req.params` tipado de forma específica, lo harás donde se use (como ya hicimos).
}

// --- Middleware `protect` ---
exports.protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // `req.headers` es de tipo `IncomingHttpHeaders`. 
    // Asegúrate de que tus `types` de Express sean correctas para que esto funcione.
    // Si el error `Property 'authorization' does not exist on type 'Headers'` persiste,
    // puede requerir una aserción de tipo más explícita para `req.headers`.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new ErrorResponse('No autorizado para acceder a esta ruta (sin token)', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as { id: string }).id;
        
        req.user = await User.findById(userId); 

        if (!req.user) {
            return next(new ErrorResponse('Usuario no encontrado, token inválido', 401));
        }

        next();
    } catch (error: any) { 
        console.error('Error en authMiddleware.protect:', error);
        return next(new ErrorResponse('No autorizado, token inválido o expirado', 401));
    }
});

// --- Middleware `authorize` ---
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role as string)) {
            return next(new ErrorResponse(`El rol de usuario '${req.user?.role ?? 'desconocido'}' no está autorizado para acceder a esta ruta`, 403));
        }
        next();
    };
};

// --- Middleware `checkVehicleOwnership` ---
exports.checkVehicleOwnership = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    // `req.params.id` se accede a través de la extensión de ParamsDictionary.
    // Si el error persiste aquí, podría ser necesario añadir `ParamsDictionary`
    // en la interfaz extendida de Request, o hacer una aserción más explícita.
    const vehicleId = (req.params as { id: string }).id; // Aserción de tipo para `id`
    
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        return next(new ErrorResponse(`Vehículo no encontrado con id ${vehicleId}`, 404));
    }

    // `vehicle.ownership` debe estar tipado correctamente en `IVehicle`.
    const ownerInfo = vehicle.ownership.find(
        (o: { user_id: mongoose.Types.ObjectId; role: string }) => o.role === 'owner'
    );

    if (!ownerInfo || (ownerInfo.user_id.toString() !== req.user!.id && req.user!.role !== 'admin')) {
        return next(new ErrorResponse('No autorizado para realizar acciones en este vehículo', 403));
    }
    
    // `req.vehicle` se asigna correctamente.
    req.vehicle = vehicle; 
    next();
});