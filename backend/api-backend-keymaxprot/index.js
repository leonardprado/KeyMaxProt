const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const connectDB = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

// Configurar MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Conectar a MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de KeyMaxProt funcionando correctamente");
});

// Rutas base
app.get("/", (req, res) => {
  res.send("API de KeyMaxProt funcionando correctamente");
});

// Rutas de órdenes y pagos
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
