// types/express.d.ts (o similar)

// Importa los tipos de Mongoose y los modelos específicos que usarás
import mongoose from 'mongoose';
import { User } from '../models/User'; // Asegúrate que la ruta sea correcta
import Vehicle from '../models/Vehicle'; // Asegúrate que la ruta sea correcta

// Declara que estamos extendiendo las interfaces globales de Express
declare global {
  namespace Express {
    // Extiende la interfaz Request para añadir nuestras propiedades personalizadas
    interface Request {
      user?: User | null; // El usuario autenticado, puede ser null
      vehicle?: Vehicle;   // El vehículo adjuntado por el middleware
      // Si necesitas `req.cookies`, asegúrate de que 'cookie-parser' esté en tu `index.ts`
      // y considera declarar `cookies?: { [key: string]: string };` aquí.
      params: Request['params'] & { id: string }; // Para `req.params.id`
    }
  }
}

// No se necesita exportar nada, solo declarar.