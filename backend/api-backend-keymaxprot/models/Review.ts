// models/Review.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Review ---
// Debe reflejar todos los campos del schema. No extiende Document directamente.
export interface IReview { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // Referencia al usuario que hizo la review
  rating: number; // La calificación (1-5)
  comment?: string; // Comentario opcional
  
  // Referencia polimórfica al ítem revisado
  item: {
    id: mongoose.Types.ObjectId; // ID del ítem
    type: 'Product' | 'Shop' | 'ServiceRecord' | 'Tutorial'; // Tipos de ítems permitidos
  };
  
  createdAt: Date;
  updatedAt: Date; // Si no usas timestamps: true, este campo se maneja con hook
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IReview
const reviewSchema = new mongoose.Schema<IReview>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea el nombre correcto del modelo User
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'La calificación debe ser al menos 1'], // Mensajes de validación
    max: [5, 'La calificación no puede exceder 5'],
  },
  comment: {
    type: String,
    trim: true,
  },
  // Referencia polimórfica
  item: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'item.type', // Clave para la referencia polimórfica
    },
    type: {
      type: String,
      required: true,
      enum: ['Product', 'Shop', 'ServiceRecord', 'Tutorial'], // Tipamos el enum
    },
  },
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
  // Si no, deben estar en el schema y manejarse con hooks si es necesario.
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// --- Hook `pre('save')` para `updatedAt` ---
// Necesario si no usas `timestamps: true` en las opciones del Schema.
reviewSchema.pre('save', function(next: mongoose.HookNextFunction) {
  this.updatedAt = new Date();
  next();
});

// --- Métodos Estáticos (Statics) ---
// Los métodos estáticos se definen en `schema.statics` para ser llamados directamente en el Modelo.
// `this` dentro de `statics` se refiere al Modelo Mongoose (`ReviewModel`).
// Necesitamos tipar los argumentos `itemId` y `itemType`.
reviewSchema.statics.calculateAverageRating = async function(
  itemId: mongoose.Types.ObjectId | string, // El ID puede ser ObjectId o string
  itemType: IReview['item']['type'] // Usamos el tipo del enum para `itemType`
): Promise<void> {
  try {
    const stats = await this.aggregate([
      // Filtramos por el ID del ítem específico
      { $match: { 'item.id': new mongoose.Types.ObjectId(itemId) } }, // Convertir itemId a ObjectId para la comparación
      // Agrupamos por ítem para calcular el promedio y el conteo
      { $group: {
          _id: '$item.id', // Agrupar por el ID del ítem
          reviewCount: { $sum: 1 }, // Contar cuántas reviews hay
          averageRating: { $avg: '$rating' } // Calcular el promedio de las calificaciones
      }}
    ]);

    // Obtenemos el modelo dinámicamente usando el tipo proporcionado
    const Model = mongoose.model<any>(itemType); // `any` es un fallback, idealmente se usaría un tipo genérico o mapeo
    
    if (stats.length > 0 && stats[0]._id) {
      // Si hay estadísticas, actualizamos el modelo del ítem
      await Model.findByIdAndUpdate(stats[0]._id, {
        reviewCount: stats[0].reviewCount,
        // Aseguramos que el promedio tenga 2 decimales
        averageRating: parseFloat(stats[0].averageRating.toFixed(2)) 
      });
    } else {
      // Si no hay reviews para este ítem, reiniciamos los contadores
      await Model.findByIdAndUpdate(itemId, { reviewCount: 0, averageRating: 0 });
    }
  } catch (error: any) {
    console.error(`Error calculating average rating for ${itemType} ID ${itemId}:`, error);
    // No lanzamos error aquí para no detener el proceso si falla el cálculo del rating
  }
};

// --- Hooks `post` ---
// Estos hooks se ejecutan después de que la operación (save, remove) se completa.
// `this` aquí se refiere al documento que fue guardado o eliminado.

reviewSchema.post('save', async function(doc) { // `doc` es el documento guardado
  // Llamamos al método estático `calculateAverageRating`.
  // `this` es el documento guardado, que tiene `item.id` y `item.type`.
  // Usamos `this.constructor` para acceder a los statics del modelo.
  await (this.constructor as any).calculateAverageRating(this.item.id, this.item.type);
});

reviewSchema.post('remove', async function() { // `this` aquí se refiere al documento eliminado
  // Llamamos al método estático `calculateAverageRating` para recalcular después de eliminar.
  await (this.constructor as any).calculateAverageRating(this.item.id, this.item.type);
});


// --- Define el Tipo del Modelo Mongoose ---
export type ReviewModel = Model<IReview>;

// --- Crea y Exporta el Modelo ---
const Review = mongoose.model<IReview, ReviewModel>('Review', reviewSchema);

export default Review; // Exportación por defecto del modelo

