const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'KeymaxProt API',
      version: '1.0.0',
      description: 'Documentación de la API para la plataforma KeymaxProt...',
      contact: { name: 'Tu Nombre', email: 'tuemail@ejemplo.com' }
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3001}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
    // Aquí puedes añadir los schemas y tags si quieres, o dejarlos en index.js
    // por ahora lo dejamos así para simplificar.
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;