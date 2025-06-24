import React from "react";
import { useProductContext } from "../contexts/ProductContext";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { productos } = useProductContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {productos.map((prod) => (
        <Link
          to={`/productos/${prod.id}`}
          key={prod.id}
          className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg block"
        >
          <img src={prod.imagen} alt={prod.nombre} className="w-full h-40 object-contain mb-2" />
          <h3 className="font-bold text-lg">{prod.nombre}</h3>
          <p className="text-orange-600 font-bold text-xl">${prod.precio.toLocaleString()}</p>
          <p className="text-gray-500 line-through">${prod.precioOriginal.toLocaleString()}</p>
          <p className="text-sm text-gray-600">{prod.descripcion.slice(0, 40)}...</p>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;