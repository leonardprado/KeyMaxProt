const express = require('express');

const cors = require("cors");
const mercadopago = require("mercadopago");
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');
const messageRoutes = require('./routes/messageRoutes');
const serviceCatalogRoutes = require('./routes/serviceCatalogRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const colors = require('colors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

// Seguridad de la API
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// const xss = require('xss-clean');

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100 // Limita cada IP a 100 solicitudes por windowMs
});
app.use(limiter);


// app.use(xss());
app.use(cors());

// Swagger JSDoc setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'KeymaxProt API',
      version: '1.0.0',
      description: 'Documentación de la API para la plataforma KeymaxProt, un sistema de gestión de talleres y marketplace.',
      contact: {
        name: 'Tu Nombre',
        email: 'tuemail@ejemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api' // Cambia el puerto si es necesario
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
    schemas: {
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único del producto', example: '60c72b2f9b1d8c001f8e4cde' },
          name: { type: 'string', description: 'Nombre del producto', example: 'Filtro de Aceite Premium' },
          description: { type: 'string', description: 'Descripción detallada del producto', example: 'Filtro de aceite de alta eficiencia para una protección superior del motor.' },
          price: { type: 'number', format: 'float', description: 'Precio del producto', example: 25.99 },
          category: { type: 'string', description: 'Categoría del producto', example: 'Mantenimiento' },
          stock: { type: 'integer', description: 'Cantidad en stock', example: 150 },
          sku: { type: 'string', description: 'SKU del producto', example: 'FA-001-PREM' },
          brand: { type: 'string', description: 'Marca del producto', example: 'AutoCare' },
          weight: { type: 'number', format: 'float', description: 'Peso del producto en kg', example: 0.3 },
          dimensions: { type: 'string', description: 'Dimensiones del producto (ej. 10x10x5 cm)', example: '10x10x5 cm' },
          averageRating: { type: 'number', format: 'float', description: 'Calificación promedio del producto', example: 4.7 },
          reviewCount: { type: 'integer', description: 'Número total de reseñas', example: 75 },
          imageUrl: { type: 'string', description: 'URL de la imagen del producto', example: 'https://example.com/images/filtro_aceite.jpg' },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del producto' },
        },
        example: {
          _id: '60c72b2f9b1d8c001f8e4cde',
          name: 'Filtro de Aceite Premium',
          description: 'Filtro de aceite de alta eficiencia para una protección superior del motor.',
          price: 25.99,
          category: 'Mantenimiento',
          stock: 150,
          sku: 'FA-001-PREM',
          brand: 'AutoCare',
          weight: 0.3,
          dimensions: '10x10x5 cm',
          averageRating: 4.7,
          reviewCount: 75,
          imageUrl: 'https://example.com/images/filtro_aceite.jpg',
          createdAt: '2023-01-01T10:00:00Z',
        },
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'price', 'category', 'stock'],
        properties: {
          name: { type: 'string', description: 'Nombre del producto', example: 'Filtro de Aceite Premium' },
          description: { type: 'string', description: 'Descripción detallada del producto', example: 'Filtro de aceite de alta eficiencia para una protección superior del motor.' },
          price: { type: 'number', format: 'float', description: 'Precio del producto', example: 25.99 },
          category: { type: 'string', description: 'Categoría del producto', example: 'Mantenimiento' },
          stock: { type: 'integer', description: 'Cantidad en stock', example: 150 },
          sku: { type: 'string', description: 'SKU del producto', example: 'FA-001-PREM' },
          brand: { type: 'string', description: 'Marca del producto', example: 'AutoCare' },
          weight: { type: 'number', format: 'float', description: 'Peso del producto en kg', example: 0.3 },
          dimensions: { type: 'string', description: 'Dimensiones del producto (ej. 10x10x5 cm)', example: '10x10x5 cm' },
          imageUrl: { type: 'string', description: 'URL de la imagen del producto', example: 'https://example.com/images/filtro_aceite.jpg' }
        },
        example: {
          name: 'Filtro de Aceite Premium',
          description: 'Filtro de aceite de alta eficiencia para una protección superior del motor.',
          price: 25.99,
          category: 'Mantenimiento',
          stock: 150,
          sku: 'FA-001-PREM',
          brand: 'AutoCare',
          weight: 0.3,
          dimensions: '10x10x5 cm',
          imageUrl: 'https://example.com/images/filtro_aceite.jpg'
        }
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único de la reseña', example: '60c72b2f9b1d8c001f8e4cde' },
          author: { type: 'string', description: 'ID del usuario que escribió la reseña', example: '60d0fe4f5311236168a109c3' },
          rating: { type: 'number', format: 'float', description: 'Calificación de la reseña (1-5)', example: 4.5 },
          comment: { type: 'string', description: 'Comentario de la reseña', example: 'Excelente servicio, muy profesionales.' },
          item: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del elemento reseñado (Producto, Taller, Servicio, Tutorial)', example: '60d0fe4f5311236168a109c1' },
              type: { type: 'string', enum: ['Product', 'Shop', 'Service', 'Tutorial'], description: 'Tipo del elemento reseñado', example: 'Shop' },
            },
            description: 'Información del elemento al que pertenece la reseña',
          },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación de la reseña' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Fecha de última actualización de la reseña' },
        },
        example: {
          _id: '60c72b2f9b1d8c001f8e4cde',
          author: '60d0fe4f5311236168a109c3',
          rating: 4.5,
          comment: 'Excelente servicio, muy profesionales.',
          item: { id: '60d0fe4f5311236168a109c1', type: 'Shop' },
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: '2023-01-01T10:30:00Z',
        },
      },
      Service: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'Service ID' },
          nombre: { type: 'string', description: 'Name of the service' },
          categoria: { type: 'string', description: 'Category of the service' },
          subcategoria: { type: 'string', description: 'Subcategory of the service' },
          descripcion: { type: 'string', description: 'Description of the service' },
          precio: { type: 'number', description: 'Price of the service' },
          duracionEstimada: { type: 'string', description: 'Estimated duration of the service' },
          disponibilidad: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fecha: { type: 'string', format: 'date', description: 'Date of availability' },
                horas: {
                  type: 'array',
                  items: { type: 'string', description: 'Available time slot (e.g., HH:MM)' },
                },
              },
            },
            description: 'Available dates and times for the service',
          },
          requisitos: {
            type: 'array',
            items: { type: 'string' },
            description: 'Requirements for the service',
          },
          incluye: {
            type: 'array',
            items: { type: 'string' },
            description: 'What is included in the service',
          },
          noIncluye: {
            type: 'array',
            items: { type: 'string' },
            description: 'What is not included in the service',
          },
          garantia: { type: 'string', description: 'Warranty information' },
          imagenes: {
            type: 'array',
            items: { type: 'string' },
            description: 'URLs of images related to the service',
          },
          videos: {
            type: 'array',
            items: { type: 'string' },
            description: 'URLs of videos related to the service',
          },
          calificaciones: {
            type: 'array',
            items: { type: 'string', description: 'Review ID' },
            description: 'List of review IDs for the service',
          },
          tecnicos: {
            type: 'array',
            items: { type: 'string', description: 'Technician ID' },
            description: 'List of technician IDs who can perform this service',
          },
          activo: { type: 'boolean', description: 'Is the service active?' },
          destacado: { type: 'boolean', description: 'Is the service featured?' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
        },
        example: {
          _id: '60d0fe4f5311236168a109c5',
          nombre: { type: 'string', description: 'Nombre del servicio', example: 'Cambio de Aceite Básico' },
          categoria: { type: 'string', description: 'Categoría del servicio', example: 'Mantenimiento' },
          subcategoria: { type: 'string', description: 'Subcategoría del servicio', example: 'Motor' },
          descripcion: { type: 'string', description: 'Descripción detallada del servicio', example: 'Servicio de cambio de aceite y filtro básico para vehículos de pasajeros.' },
          precio: { type: 'number', format: 'float', description: 'Precio del servicio', example: 45.00 },
          duracionEstimada: { type: 'string', description: 'Duración estimada del servicio', example: '1 hora' },
          disponibilidad: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fecha: { type: 'string', format: 'date', description: 'Fecha de disponibilidad', example: '2023-10-26' },
                horas: {
                  type: 'array',
                  items: { type: 'string', description: 'Franja horaria disponible (ej. HH:MM)', example: '09:00' },
                },
              },
            },
            description: 'Fechas y horas disponibles para el servicio',
          },
          requisitos: { type: 'array', items: { type: 'string' }, description: 'Requisitos para el servicio', example: ['Vehículo con motor de combustión interna'] },
          incluye: { type: 'array', items: { type: 'string' }, description: 'Qué incluye el servicio', example: ['Aceite de motor (hasta 5L)', 'Filtro de aceite', 'Mano de obra'] },
          noIncluye: { type: 'array', items: { type: 'string' }, description: 'Qué no incluye el servicio', example: ['Filtro de aire', 'Revisión de frenos'] },
          garantia: { type: 'string', description: 'Información de garantía', example: '3 meses o 5,000 km' },
          imagenes: { type: 'array', items: { type: 'string' }, description: 'URLs de imágenes relacionadas con el servicio', example: ['http://example.com/oil_change.jpg'] },
          videos: { type: 'array', items: { type: 'string' }, description: 'URLs de videos relacionados con el servicio', example: [] },
          calificaciones: { type: 'array', items: { type: 'string' }, description: 'Lista de IDs de reseñas para el servicio', example: [] },
          tecnicos: { type: 'array', items: { type: 'string' }, description: 'Lista de IDs de técnicos que pueden realizar este servicio', example: ['60d0fe4f5311236168a109c6'] },
          activo: { type: 'boolean', description: 'Indica si el servicio está activo', example: true },
          destacado: { type: 'boolean', description: 'Indica si el servicio es destacado', example: false },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del servicio', example: '2023-01-01T12:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Fecha de la última actualización del servicio', example: '2023-01-01T12:00:00Z' },
      },
      ServiceInput: {
        type: 'object',
        required: ['nombre', 'categoria', 'precio', 'duracionEstimada'],
        properties: {
          nombre: { type: 'string', description: 'Nombre del servicio', example: 'Cambio de Aceite Básico' },
          categoria: { type: 'string', description: 'Categoría del servicio', example: 'Mantenimiento' },
          subcategoria: { type: 'string', description: 'Subcategoría del servicio', example: 'Motor' },
          descripcion: { type: 'string', description: 'Descripción detallada del servicio', example: 'Servicio de cambio de aceite y filtro básico para vehículos de pasajeros.' },
          precio: { type: 'number', format: 'float', description: 'Precio del servicio', example: 45.00 },
          duracionEstimada: { type: 'string', description: 'Duración estimada del servicio', example: '1 hora' },
          disponibilidad: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fecha: { type: 'string', format: 'date', description: 'Fecha de disponibilidad', example: '2023-10-26' },
                horas: {
                  type: 'array',
                  items: { type: 'string', description: 'Franja horaria disponible (ej. HH:MM)', example: '09:00' },
                },
              },
            },
            description: 'Fechas y horas disponibles para el servicio',
          },
          requisitos: { type: 'array', items: { type: 'string' }, description: 'Requisitos para el servicio', example: ['Vehículo con motor de combustión interna'] },
          incluye: { type: 'array', items: { type: 'string' }, description: 'Qué incluye el servicio', example: ['Aceite de motor (hasta 5L)', 'Filtro de aceite', 'Mano de obra'] },            items: { type: 'string' },
            description: 'What is included in the service',
          },
          noIncluye: {
            type: 'array',
            items: { type: 'string' },
            description: 'What is not included in the service',
          },
          garantia: { type: 'string', description: 'Warranty information' },
          imagenes: {
            type: 'array',
            items: { type: 'string' },
            description: 'URLs of images related to the service',
          },
          videos: {
            type: 'array',
            items: { type: 'string' },
            description: 'URLs of videos related to the service',
          },
          tecnicos: {
            type: 'array',
            items: { type: 'string', description: 'Technician ID' },
            description: 'List of technician IDs who can perform this service',
          },
          activo: { type: 'boolean', description: 'Is the service active?' },
          destacado: { type: 'boolean', description: 'Is the service featured?' },
        },
        example: {
          nombre: 'Revisión de Frenos',
          categoria: 'Seguridad',
          subcategoria: 'Frenos',
          descripcion: 'Inspección completa del sistema de frenos, incluyendo pastillas, discos y líquido.',
          precio: 30.00,
          duracionEstimada: '45 minutos',
          disponibilidad: [
            { fecha: '2023-10-27', horas: ['14:00', '15:00'] },
          ],
          requisitos: [],
          incluye: ['Inspección visual', 'Reporte de estado'],
          noIncluye: ['Reemplazo de piezas'],
          garantia: '1 mes',
          imagenes: [],
          videos: [],
          tecnicos: ['60d0fe4f5311236168a109c7'],
          activo: true,
          destacado: true,
        },
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único de la orden', example: '60d0fe4f5311236168a109c8' },
          user: { type: 'string', description: 'ID del usuario que realizó la orden', example: '60d0fe4f5311236168a109c3' },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product: { type: 'string', description: 'ID del producto', example: '60d0fe4f5311236168a109c1' },
                quantity: { type: 'number', description: 'Cantidad del producto', example: 1 },
              },
            },
            description: 'Lista de productos en la orden',
          },
          totalPrice: { type: 'number', format: 'float', description: 'Precio total de la orden', example: 99.99 },
          status: { type: 'string', enum: ['pending', 'completed', 'cancelled'], description: 'Estado de la orden', example: 'pending' },
          shippingAddress: { type: 'string', description: 'Dirección de envío de la orden', example: '123 Calle Principal, Ciudad, País' },
          payment: { type: 'string', description: 'ID del pago asociado a la orden', example: '60d0fe4f5311236168a109c9' },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación de la orden', example: '2023-01-01T12:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Fecha de la última actualización de la orden', example: '2023-01-01T12:00:00Z' },
        },
        example: {
          _id: '60d0fe4f5311236168a109c8',
          user: '60d0fe4f5311236168a109c3',
          products: [
            { product: '60d0fe4f5311236168a109c1', quantity: 1 },
          ],
          totalPrice: 99.99,
          status: 'pending',
          shippingAddress: '123 Calle Principal, Ciudad, País',
          payment: '60d0fe4f5311236168a109c9',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z',
        },
      },
      OrderInput: {
        type: 'object',
        required: ['products', 'totalPrice'],
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product: { type: 'string', description: 'ID del producto', example: '60d0fe4f5311236168a109c1' },
                quantity: { type: 'number', description: 'Cantidad del producto', example: 1 },
              },
            },
            description: 'Lista de productos en la orden',
          },
          totalPrice: { type: 'number', format: 'float', description: 'Precio total de la orden', example: 99.99 },
          shippingAddress: { type: 'string', description: 'Dirección de envío de la orden', example: '123 Calle Principal, Ciudad, País' },
        },
        example: {
          products: [
            { product: '60d0fe4f5311236168a109c1', quantity: 1 },
          ],
          totalPrice: 99.99,
          shippingAddress: '123 Calle Principal, Ciudad, País',
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único del vehículo', example: '60d0fe4f5311236168a109ca' },
          user: { type: 'string', description: 'ID del usuario propietario del vehículo', example: '60d0fe4f5311236168a109c3' },
          make: { type: 'string', description: 'Marca del vehículo', example: 'Toyota' },
          model: { type: 'string', description: 'Modelo del vehículo', example: 'Corolla' },
          year: { type: 'number', description: 'Año del vehículo', example: 2020 },
          vin: { type: 'string', description: 'Número de Identificación Vehicular (VIN)', example: '1234567890ABCDEFG' },
          licensePlate: { type: 'string', description: 'Número de matrícula', example: 'XYZ-789' },
          color: { type: 'string', description: 'Color del vehículo', example: 'Rojo' },
          engine: { type: 'string', description: 'Tipo de motor', example: '1.8L I4' },
          transmission: { type: 'string', description: 'Tipo de transmisión', example: 'Automática' },
          fuelType: { type: 'string', description: 'Tipo de combustible', example: 'Gasolina' },
          serviceHistory: {
            type: 'array',
            items: { type: 'string', description: 'ID del registro de servicio' },
            description: 'Lista de IDs de registros de servicio para el vehículo',
          },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del registro del vehículo', example: '2023-01-01T12:00:00Z' },
        },
        example: {
          _id: '60d0fe4f5311236168a109ca',
          user: '60d0fe4f5311236168a109c3',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          vin: '1234567890ABCDEFG',
          licensePlate: 'XYZ-789',
          color: 'Rojo',
          engine: '1.8L I4',
          transmission: 'Automática',
          fuelType: 'Gasolina',
          serviceHistory: [],
          createdAt: '2023-01-01T12:00:00Z',
        },
      },
      VehicleInput: {
        type: 'object',
        required: ['make', 'model', 'year', 'vin', 'licensePlate'],
        properties: {
          make: { type: 'string', description: 'Marca del vehículo', example: 'Honda' },
          model: { type: 'string', description: 'Modelo del vehículo', example: 'Civic' },
          year: { type: 'number', description: 'Año del vehículo', example: 2018 },
          vin: { type: 'string', description: 'Número de Identificación Vehicular (VIN)', example: 'ABCDEFGHIJKLMNO' },
          licensePlate: { type: 'string', description: 'Número de matrícula', example: 'ABC-123' },
          color: { type: 'string', description: 'Color del vehículo', example: 'Azul' },
          engine: { type: 'string', description: 'Tipo de motor', example: '2.0L I4' },
          transmission: { type: 'string', description: 'Tipo de transmisión', example: 'Manual' },
          fuelType: { type: 'string', description: 'Tipo de combustible', example: 'Gasolina' },
        },
        example: {
          make: 'Honda',
          model: 'Civic',
          year: 2018,
          vin: 'ABCDEFGHIJKLMNO',
          licensePlate: 'ABC-123',
          color: 'Azul',
          engine: '2.0L I4',
          transmission: 'Manual',
          fuelType: 'Gasolina',
        },
      },
      Tutorial: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único del tutorial', example: '60d0fe4f5311236168a109cb' },
          title: { type: 'string', description: 'Título del tutorial', example: 'Cómo Cambiar el Aceite de tu Coche' },
          description: { type: 'string', description: 'Descripción del tutorial', example: 'Una guía paso a paso para cambiar el aceite de motor de tu vehículo.' },
          contentUrl: { type: 'string', format: 'url', description: 'URL al contenido del tutorial (ej. video, artículo externo)', example: 'http://example.com/tutorial_oil_change.mp4' },
          contentBody: { type: 'string', description: 'Contenido completo del tutorial en texto', example: 'Aquí va el contenido detallado del tutorial...' },
          category: { type: 'string', description: 'Categoría del tutorial', example: 'Mantenimiento Básico' },
          author: { type: 'string', description: 'ID del usuario autor del tutorial', example: '60d0fe4f5311236168a109c3' },
          difficultyLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], description: 'Nivel de dificultad del tutorial', example: 'beginner' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Etiquetas asociadas con el tutorial', example: ['aceite', 'mantenimiento', 'coche']
          },
          averageRating: { type: 'number', format: 'float', description: 'Calificación promedio del tutorial', example: 4.8 },
          reviews: {
            type: 'array',
            items: { type: 'string', description: 'ID de la reseña' },
            description: 'Lista de IDs de reseñas para el tutorial', example: []
          },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del tutorial', example: '2023-01-01T12:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Fecha de la última actualización del tutorial', example: '2023-01-01T12:00:00Z' },
        },
        example: {
          _id: '60d0fe4f5311236168a109cb',
          title: 'Cómo Cambiar el Aceite de tu Coche',
          description: 'Una guía paso a paso para cambiar el aceite de motor de tu vehículo.',
          contentUrl: 'http://example.com/tutorial_oil_change.mp4',
          contentBody: 'Aquí va el contenido detallado del tutorial...', 
          category: 'Mantenimiento Básico',
          author: '60d0fe4f5311236168a109c3',
          difficultyLevel: 'beginner',
          tags: ['aceite', 'mantenimiento', 'coche'],
          averageRating: 4.8,
          reviews: [],
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z',
        },
      },
      TutorialInput: {
        type: 'object',
        required: ['title', 'description', 'category'],
        properties: {
          title: { type: 'string', description: 'Título del tutorial', example: 'Guía para el Cuidado de Neumáticos' },
          description: { type: 'string', description: 'Descripción del tutorial', example: 'Consejos esenciales para prolongar la vida útil de tus neumáticos.' },
          contentUrl: { type: 'string', format: 'url', description: 'URL al contenido del tutorial (ej. video, artículo externo)', example: 'http://example.com/tutorial_neumaticos.mp4' },
          contentBody: { type: 'string', description: 'Contenido completo del tutorial en texto', example: 'El mantenimiento adecuado de los neumáticos es crucial...' },
          category: { type: 'string', description: 'Categoría del tutorial', example: 'Seguridad' },
          difficultyLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], description: 'Nivel de dificultad del tutorial', example: 'beginner' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Etiquetas asociadas con el tutorial', example: ['neumáticos', 'seguridad', 'mantenimiento']
          },
        },
        example: {
          title: 'Guía para el Cuidado de Neumáticos',
          description: 'Consejos esenciales para prolongar la vida útil de tus neumáticos.',
          contentBody: 'El mantenimiento adecuado de los neumáticos es crucial...', 
          category: 'Seguridad',
          difficultyLevel: 'beginner',
          tags: ['neumáticos', 'seguridad', 'mantenimiento'],
        },
      },
      Message: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único del mensaje', example: '60d0fe4f5311236168a109cc' },
          conversation: { type: 'string', description: 'ID de la conversación a la que pertenece el mensaje', example: '60d0fe4f5311236168a109cd' },
          sender: { type: 'string', description: 'ID del usuario que envía el mensaje', example: '60d0fe4f5311236168a109c3' },
          text: { type: 'string', description: 'Contenido de texto del mensaje', example: 'Hola, ¿cómo estás?' },
          mediaUrl: { type: 'string', format: 'url', description: 'URL a contenido multimedia (imagen, video, etc.)', example: 'http://example.com/image.jpg' },
          readBy: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: { type: 'string', description: 'ID del usuario que leyó el mensaje', example: '60d0fe4f5311236168a109c4' },
                readAt: { type: 'string', format: 'date-time', description: 'Marca de tiempo cuando el mensaje fue leído', example: '2023-01-01T12:00:00Z' },
              },
            },
            description: 'Lista de usuarios que han leído el mensaje',
          },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del mensaje', example: '2023-01-01T12:00:00Z' },
        },
        example: {
          _id: '60d0fe4f5311236168a109cc',
          conversation: '60d0fe4f5311236168a109cd',
          sender: '60d0fe4f5311236168a109c3',
          text: 'Hola, ¿cómo estás?',
          mediaUrl: 'http://example.com/image.jpg',
          readBy: [
            { user: '60d0fe4f5311236168a109c4', readAt: '2023-01-01T12:00:00Z' }
          ],
          createdAt: '2023-01-01T12:00:00Z',
        },
      },
      MessageInput: {
        type: 'object',
        required: ['conversation', 'sender', 'text'],
        properties: {
          conversation: { type: 'string', description: 'ID de la conversación a la que pertenece el mensaje', example: '60d0fe4f5311236168a109cd' },
          sender: { type: 'string', description: 'ID del usuario que envía el mensaje', example: '60d0fe4f5311236168a109c3' },
          text: { type: 'string', description: 'Contenido de texto del mensaje', example: 'Hola, ¿cómo estás?' },
          mediaUrl: { type: 'string', format: 'url', description: 'URL a contenido multimedia (imagen, video, etc.)', example: 'http://example.com/image.jpg' },
        },
        example: {
          conversation: '60d0fe4f5311236168a109cd',
          sender: '60d0fe4f5311236168a109c3',
          text: 'Hola, ¿cómo estás?',
          mediaUrl: 'http://example.com/image.jpg',
        },
      },
      Shop: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único del taller', example: '60c72b2f9b1d8c001f8e4cde' },
          name: { type: 'string', description: 'Nombre del taller', example: 'Taller Martinez Sport' },
          description: { type: 'string', description: 'Descripción del taller' },
          owner_id: { type: 'string', description: 'ID del usuario dueño' },
          address: { type: 'string', description: 'Dirección del taller' },
          phone: { type: 'string', description: 'Número de teléfono del taller' },
          email: { type: 'string', format: 'email', description: 'Correo electrónico del taller' },
          offeredServices: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de servicios ofrecidos por el taller',
          },
          technician_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de técnicos asociados con el taller',
          },
          location: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['Point'] },
              coordinates: { type: 'array', items: { type: 'number' } },
            },
            description: 'Coordenadas geoespaciales del taller',
          },
          openingHours: { type: 'string', description: 'Horario de apertura del taller' },
          average_rating: { type: 'number', format: 'float', description: 'Calificación promedio del taller (1-5)' },
          review_count: { type: 'integer', description: 'Número total de reseñas del taller' },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del taller' },
        },
        example: {
          _id: '60c72b2f9b1d8c001f8e4cde',
          name: 'Taller Martinez Sport',
          description: 'Especialistas en mecánica general y deportiva.',
          owner_id: '60d0fe4f5311236168a109c3',
          address: 'Av. Principal 123, Ciudad',
          phone: '+34 912 345 678',
          email: 'contacto@tallermartinez.com',
          email: 'info@keymaxprot.com',
          offeredServices: ['60d0fe4f5311236168a109cd'],
          technician_ids: ['60d0fe4f5311236168a109ce'],
          location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
          openingHours: 'Mon-Fri: 9 AM - 6 PM',
          rating: 4.5,
          reviews: ['60d0fe4f5311236168a109cf'],
          averageRating: 4.5,
          reviewCount: 10,
          createdAt: '2023-01-01T12:00:00Z',
        },
      },
      ShopInput: {
        type: 'object',
        required: ['name', 'address', 'phone', 'email', 'owner_id'],
        properties: {
          name: { type: 'string', description: 'Nombre del taller', example: 'Taller Martinez Sport' },
          description: { type: 'string', description: 'Descripción del taller' },
          owner_id: { type: 'string', description: 'ID del usuario dueño' },
          address: { type: 'string', description: 'Dirección del taller' },
          phone: { type: 'string', description: 'Número de teléfono del taller' },
          email: { type: 'string', format: 'email', description: 'Correo electrónico del taller' },
          offeredServices: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de servicios ofrecidos por el taller',
          },
          technician_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de técnicos asociados con el taller',
          },
          location: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['Point'] },
              coordinates: { type: 'array', items: { type: 'number' } },
            },
            description: 'Coordenadas geoespaciales del taller',
          },
          openingHours: { type: 'string', description: 'Horario de apertura del taller' },
        },
        example: {
          name: 'Taller Martinez Sport',
          description: 'Especialistas en mecánica general y deportiva.',
          owner_id: '60d0fe4f5311236168a109c3',
          address: 'Av. Principal 123, Ciudad',
          phone: '+34 912 345 678',
          email: 'contacto@tallermartinez.com',
          offeredServices: ['60d0fe4f5311236168a109cd'],
          technician_ids: ['60d0fe4f5311236168a109ce'],
          location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
          openingHours: 'Lunes-Viernes 9 AM - 6 PM',
        },
      },
      Technician: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único del técnico', example: '60d0fe4f5311236168a109cc' },
          user_id: { type: 'string', description: 'ID del usuario asociado al técnico', example: '60d0fe4f5311236168a109cd' },
          name: { type: 'string', description: 'Nombre del técnico', example: 'Juan Pérez' },
          specialty: { type: 'string', description: 'Especialidad del técnico', example: 'Reparación de Motores' },
          contact: {
            type: 'object',
            properties: {
              phone: { type: 'string', description: 'Número de teléfono del técnico', example: '123-456-7890' },
              email: { type: 'string', format: 'email', description: 'Correo electrónico del técnico', example: 'juan.perez@example.com' },
            },
            description: 'Información de contacto del técnico',
          },
          shops: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de talleres donde trabaja el técnico', example: ['60d0fe4f5311236168a109ce']
          },
          availability: { type: 'string', description: 'Disponibilidad del técnico', example: 'Lunes-Viernes 9 AM - 5 PM' },
          rating: { type: 'number', format: 'float', description: 'Calificación promedio del técnico (1-5)', example: 4.8 },
          reviews: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de reseñas para el técnico', example: ['60d0fe4f5311236168a109cf']
          },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del registro del técnico', example: '2023-01-01T12:00:00Z' },
        },
        example: {
          _id: '60d0fe4f5311236168a109cc',
          user_id: '60d0fe4f5311236168a109cd',
          name: 'Juan Pérez',
          specialty: 'Reparación de Motores',
          contact: { phone: '123-456-7890', email: 'juan.perez@example.com' },
          shops: ['60d0fe4f5311236168a109ce'],
          availability: 'Lunes-Viernes 9 AM - 5 PM',
          rating: 4.8,
          reviews: ['60d0fe4f5311236168a109cf'],
          createdAt: '2023-01-01T12:00:00Z',
        },
      },
      TechnicianInput: {
        type: 'object',
        required: ['user_id', 'name', 'contact'],
        properties: {
          user_id: { type: 'string', description: 'ID del usuario asociado al técnico', example: '60d0fe4f5311236168a109cd' },
          name: { type: 'string', description: 'Nombre del técnico', example: 'Juan Pérez' },
          specialty: { type: 'string', description: 'Especialidad del técnico', example: 'Reparación de Motores' },
          contact: {
            type: 'object',
            properties: {
              phone: { type: 'string', description: 'Número de teléfono del técnico', example: '123-456-7890' },
              email: { type: 'string', format: 'email', description: 'Correo electrónico del técnico', example: 'juan.perez@example.com' },
            },
            required: ['phone', 'email'],
            description: 'Información de contacto del técnico',
          },
          shops: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de talleres donde trabaja el técnico', example: ['60d0fe4f5311236168a109ce']
          },
          availability: { type: 'string', description: 'Disponibilidad del técnico', example: 'Lunes-Viernes 9 AM - 5 PM' },
          rating: { type: 'number', format: 'float', description: 'Calificación promedio del técnico (1-5)', example: 4.8 },
          reviews: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de reseñas para el técnico', example: ['60d0fe4f5311236168a109cf']
          },
        },
        example: {
          user_id: '60d0fe4f5311236168a109cd',
          name: 'Juan Pérez',
          specialty: 'Reparación de Motores',
          contact: { phone: '123-456-7890', email: 'juan.perez@example.com' },
          shops: ['60d0fe4f5311236168a109ce'],
          availability: 'Lunes-Viernes 9 AM - 5 PM',
          rating: 4.8,
          reviews: ['60d0fe4f5311236168a109cf'],
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'ID único del usuario', example: '60d0fe4f5311236168a109cc' },
          username: { type: 'string', description: 'Nombre de usuario', example: 'usuarioEjemplo' },
          email: { type: 'string', format: 'email', description: 'Correo electrónico del usuario', example: 'usuario@example.com' },
          role: { type: 'string', enum: ['user', 'admin', 'tecnico'], description: 'Rol del usuario en el sistema', example: 'user' },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación del usuario', example: '2023-01-01T12:00:00Z' },
          profile: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre del usuario', example: 'Juan' },
              lastName: { type: 'string', description: 'Apellido del usuario', example: 'Pérez' },
              address: { type: 'string', description: 'Dirección de residencia del usuario', example: 'Calle Falsa 123' },
              phone: { type: 'string', description: 'Número de teléfono del usuario', example: '555-123-4567' },
            },
            description: 'Información del perfil del usuario',
          },
          vehicles: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de vehículos propiedad del usuario', example: ['60d0fe4f5311236168a109cd']
          },
          serviceHistory: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de registros de servicio del usuario', example: ['60d0fe4f5311236168a109ce']
          },
          orders: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de pedidos realizados por el usuario', example: ['60d0fe4f5311236168a109cf']
          },
          payments: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array de IDs de pagos realizados por el usuario', example: ['60d0fe4f5311236168a109d0']
          },
        },
        example: {
          _id: '60d0fe4f5311236168a109cc',
          username: 'usuarioEjemplo',
          email: 'usuario@example.com',
          role: 'user',
          createdAt: '2023-01-01T12:00:00Z',
          profile: {
            name: 'Juan',
            lastName: 'Pérez',
            address: 'Calle Falsa 123',
            phone: '555-123-4567',
          },
          vehicles: ['60d0fe4f5311236168a109cd'],
          serviceHistory: ['60d0fe4f5311236168a109ce'],
          orders: ['60d0fe4f5311236168a109cf'],
          payments: ['60d0fe4f5311236168a109d0'],
        },
      },
      UserInput: {
        type: 'object',
        required: ['username', 'email', 'password', 'profile'],
        properties: {
          username: { type: 'string', description: 'Nombre de usuario para el nuevo registro', example: 'nuevoUsuario' },
          email: { type: 'string', format: 'email', description: 'Correo electrónico del usuario', example: 'nuevo@example.com' },
          password: { type: 'string', format: 'password', description: 'Contraseña del usuario', example: 'contraseñaSegura123' },
          role: { type: 'string', enum: ['user', 'admin', 'tecnico'], description: 'Rol del usuario en el sistema', example: 'user' },
          profile: {
            type: 'object',
            required: ['name', 'lastName', 'address', 'phone'],
            properties: {
              name: { type: 'string', description: 'Nombre del usuario', example: 'Ana' },
              lastName: { type: 'string', description: 'Apellido del usuario', example: 'Gómez' },
              address: { type: 'string', description: 'Dirección de residencia del usuario', example: 'Avenida Siempre Viva 742' },
              phone: { type: 'string', description: 'Número de teléfono del usuario', example: '555-987-6543' },
            },
            description: 'Información del perfil del usuario',
          },
        },
        example: {
          username: 'nuevoUsuario',
          email: 'nuevo@example.com',
          password: 'contraseñaSegura123',
          role: 'user',
          profile: {
            name: 'Ana',
            lastName: 'Gómez',
            address: 'Avenida Siempre Viva 742',
            phone: '555-987-6543',
          },
        },
      },
      },
      ReviewInput: {
        type: 'object',
        required: ['author', 'rating', 'comment', 'item'],
        properties: {
          author: { type: 'string', description: 'ID del usuario que escribe la reseña', example: '60d0fe4f5311236168a109c3' },
          rating: { type: 'number', format: 'float', description: 'Calificación de la reseña (1-5)', example: 4.5 },
          comment: { type: 'string', description: 'Comentario de la reseña', example: 'Excelente servicio, muy profesionales.' },
          item: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del elemento reseñado (Producto, Taller, Servicio, Tutorial)', example: '60d0fe4f5311236168a109c1' },
              type: { type: 'string', enum: ['Product', 'Shop', 'Service', 'Tutorial'], description: 'Tipo del elemento reseñado', example: 'Shop' },
            },
            description: 'Información del elemento al que pertenece la reseña',
          },
        },
        example: {
          author: '60d0fe4f5311236168a109c3',
          rating: 4.5,
          comment: 'Excelente servicio, muy profesionales.',
          item: { id: '60d0fe4f5311236168a109c1', type: 'Shop' },
        },
      },
    },
  apis: [
    './routes/authRoutes.js',
    './routes/orderRoutes.js',
    './routes/vehicleRoutes.js',
    './routes/serviceRoutes.js',
    './routes/tutorialRoutes.js',
    './routes/messageRoutes.js',
    './routes/serviceCatalogRoutes.js',
    './routes/appointmentRoutes.js',
    './routes/shopRoutes.js',
    './routes/productRoutes.js',
    './routes/reviewRoutes.js',
    './routes/technicianRoutes.js'
  ], // Path to the API routes files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use('/api/service-catalog', serviceCatalogRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/technicians', technicianRoutes);



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
