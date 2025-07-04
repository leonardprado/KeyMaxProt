const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Tiempo de espera para la selección del servidor
    });
    console.log(`MongoDB conectado exitosamente a: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error al conectar con MongoDB:');
    console.error(`- Mensaje: ${(error as Error).message}`);
    console.error(`- Código: ${(error as any).code || 'No disponible'}`);
    console.error('Por favor, verifica:');
    console.error('1. La conexión a internet');
    console.error('2. Las credenciales de MongoDB Atlas');
    console.error('3. La dirección IP está en la lista blanca de MongoDB Atlas');
    process.exit(1);
  }
};

export default connectDB;