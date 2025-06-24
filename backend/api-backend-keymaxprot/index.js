const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const connectDB = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');
const messageRoutes = require('./routes/messageRoutes');
const errorHandler = require('./middleware/errorHandler');
const colors = require('colors');
require('dotenv').config();

// Verificar variables de entorno críticas
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRE', 'MERCADOPAGO_ACCESS_TOKEN'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Error: Variable de entorno ${varName} no está definida`);
    process.exit(1);
  }
});

// Configurar MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API de KeyMaxProt funcionando correctamente",
    version: "1.0.0"
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/messages', messageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Iniciar servidor y conectar a MongoDB
const startServer = async () => {
  try {
    await connectDB(); // Esperar a que la conexión a MongoDB se establezca
    
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`✅ Servidor backend iniciado en http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
