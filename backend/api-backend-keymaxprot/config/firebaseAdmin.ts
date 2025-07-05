// config/firebaseAdmin.ts

// config/firebaseAdmin.ts

// Importa explícitamente el tipo ServiceAccount de firebase-admin
import admin, { ServiceAccount } from 'firebase-admin';

// Importa el archivo JSON como un módulo de tipo JSON
import serviceAccountJson from './firebase-service-account.json';


// Verificar si Firebase ya ha sido inicializado para evitar reinicializaciones en hot-reloads o módulos duplicados.
if (!admin.apps.length) {
  try {
    // Convertimos el JSON importado al tipo esperado por Firebase Admin SDK
    const serviceAccount: ServiceAccount = serviceAccountJson as ServiceAccount;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK inicializado correctamente.');
  } catch (error: any) {
    console.error('FATAL ERROR: Error al inicializar Firebase Admin SDK:', error);
    // Si falla la inicialización, el proceso entero debería detenerse.
    // Puedes lanzar el error para que sea capturado por un manejador global o por el `index.ts`.
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}`);
  }
} else {
  // console.log('Firebase Admin SDK ya está inicializado.'); // Log opcional
}

// Exporta la instancia inicializada
export default admin;