import withMT from "@material-tailwind/react/utils/withMT";
 
// El 'as unknown as' es una pequeña conversión de tipo que a veces es
// necesaria en TypeScript para que el export con withMT funcione sin problemas.
// No afecta la funcionalidad.
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta ruta cubre todos los archivos relevantes dentro de 'src'
  ],
  theme: {
    extend: {
      // Aquí puedes añadir tus propias clases personalizadas en el futuro.
      // Por ejemplo:
      // colors: {
      //   'keymax-blue': '#00529B',
      // },
    },
  },
  plugins: [], // Se elimina 'tailwindcss-animate' que no es de Material Tailwind
});