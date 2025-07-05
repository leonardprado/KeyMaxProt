class ErrorResponse extends Error {
  statusCode: number; // Declarar la propiedad
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
} 
 
 export default ErrorResponse;