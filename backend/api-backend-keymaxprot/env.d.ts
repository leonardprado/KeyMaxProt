// env.d.ts (si está en la raíz de tu proyecto TS o en una carpeta de tipos)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      JWT_SECRET: string; // Asegúrate de que esto coincida exactamente con tu .env
      JWT_EXPIRE: string; // Asegúrate de que esto coincida exactamente con tu .env
      // ... otras variables de entorno que uses
    }
  }
}
// Exporta algo para que sea un módulo válido, o simplemente deja así si es solo para declaración.
export {};