

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import colors from 'colors';
import swaggerUi from 'swagger-ui-express';
import mercadopago from "mercadopago";

// Importaciones de la aplicación
import connectDB from './config/database';
import swaggerDocs from './config/swaggerConfig';
import errorHandler from './middleware/errorMiddleware';

// Workers (tareas programadas)
import startMaintenanceNotifier from './workers/maintenanceNotifier';

// Rutas
import aiRoutes from './routes/aiRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import tutorialRoutes from './routes/tutorialRoutes';
import messageRoutes from './routes/messageRoutes';
import serviceCatalogRoutes from './routes/serviceCatalogRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import shopRoutes from './routes/shopRoutes';
import productRoutes from './routes/productRoutes';
import reviewRoutes from './routes/reviewRoutes';
import threadRoutes from './routes/threadRoutes';
import postRoutes from './routes/postRoutes';
import technicianRoutes from './routes/technicianRoutes';
import statsRoutes from './routes/statsRoutes';
import searchRoutes from './routes/searchRoutes';

// Inicializar la aplicación Express
const app = express();

// Middlewares Esenciales
app.use(express.json()); // Para parsear JSON
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173'] // Acepta ambos puertos
}));
app.use('/api/ai', aiRoutes);
// Middlewares de Seguridad
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200 // Limita cada IP a 200 peticiones
});
app.use(limiter);

// Configuración de MercadoPago (ahora sí tiene acceso a process.env)
mercadopago.configure({
  access_token: '',
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/service-catalog', serviceCatalogRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/search', searchRoutes);
// `postRoutes` es usado dentro de `threadRoutes`, no necesita montarse aquí.

// Ruta de Documentación de la API (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta raíz para verificar estado
app.get("/", (req, res) => {
    res.json({ status: "success", message: "API de KeyMaxProt funcionando" });
});

// Middleware de Manejo de Errores (DEBE IR AL FINAL)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Iniciar Servidor
const startServer = async () => {
    try {
        await connectDB();
        console.log(colors.cyan.underline.bold(`MongoDB conectado exitosamente`));

        // Iniciar workers después de conectar a la DB
        startMaintenanceNotifier();
        
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(colors.green.bold(`✅ Servidor backend iniciado en http://localhost:${PORT}`));
            console.log(colors.yellow(`🌍 Ambiente: ${process.env.NODE_ENV}`));
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error(colors.red.bold('❌ Error al iniciar el servidor:'), error);
        process.exit(1);
    }
};

startServer();