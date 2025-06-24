import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";
import { useCartContext } from "../contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { productos } = useProductContext();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const producto = productos.find((p) => p.id === Number(id));
  if (!producto) return <div className="text-center py-12">Producto no encontrado.</div>;

  const handleBuy = () => {
    addToCart(producto);
    navigate("/carrito");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
      <Link to="/productos" className="mb-4 text-blue-600 block">&larr; Volver</Link>
      <div className="flex flex-col md:flex-row gap-6">
        <img src={producto.imagen} alt={producto.nombre} className="w-64 h-64 object-contain" />
        <div>
          <h2 className="text-2xl font-bold mb-2">{producto.nombre}</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600 font-bold text-2xl">${producto.precio.toLocaleString()}</span>
            <span className="text-gray-500 line-through">${producto.precioOriginal.toLocaleString()}</span>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">50% OFF</span>
          </div>
          <p className="mb-2">Color: <span className="font-semibold">{producto.color}</span></p>
          <p className="mb-2">Stock disponible: <span className="font-semibold">{producto.stock}</span></p>
          <p className="mb-2">Calificación: <span className="font-semibold">{producto.rating} ⭐</span> ({producto.vendidos}+ vendidos)</p>
          <p className="mb-4">{producto.descripcion}</p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
            onClick={handleBuy}
          >
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;