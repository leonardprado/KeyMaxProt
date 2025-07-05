// middleware/asyncHandler.ts

import { Request, Response, NextFunction } from 'express';

// Definimos un tipo para la función asíncrona que recibe los parámetros de Express
type AsyncHandlerFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// La función asyncHandler toma una función `fn` del tipo AsyncHandlerFn
// y devuelve una nueva función que se encarga de manejar las promesas y errores.
const asyncHandler = (fn: AsyncHandlerFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Captura errores y los pasa a `next`
  };
};

export default asyncHandler;