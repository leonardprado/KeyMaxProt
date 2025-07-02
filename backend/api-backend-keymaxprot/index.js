

// 1. Cargar las variables de entorno PRIMERO que cualquier otra cosa.
require('dotenv').config();

const express = require('express');
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const colors = require('colors');
const swaggerUi = require('swagger-ui-express');
const mercadopago = require("mercadopago");

// Importaciones de la aplicación
const connectDB = require('./config/database');
const swaggerDocs = require('./config/swaggerConfig'); // <-- Importamos la config de Swagger
const errorHandler = require('./middleware/errorMiddleware');

// Workers (tareas programadas)
const startMaintenanceNotifier = require('./workers/maintenanceNotifier');

// Rutas
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');
const messageRoutes = require('./routes/messageRoutes');
const serviceCatalogRoutes = require('./routes/serviceCatalogRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const threadRoutes = require('./routes/threadRoutes');
const postRoutes = require('./routes/postRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Inicializar la aplicación Express
const app = express();

// Middlewares Esenciales
app.use(express.json()); // Para parsear JSON
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173'] // Acepta ambos puertos
}));

// Middlewares de Seguridad
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200 // Limita cada IP a 200 peticiones
});
app.use(limiter);

// Configuración de MercadoPago (ahora sí tiene acceso a process.env)
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
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
        console.log(`MongoDB conectado exitosamente`.cyan.underline.bold);

        // Iniciar workers después de conectar a la DB
        startMaintenanceNotifier();
        
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`✅ Servidor backend iniciado en http://localhost:${PORT}`.green.bold);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`.yellow);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:'.red.bold, error);
        process.exit(1);
    }
};

startServer();