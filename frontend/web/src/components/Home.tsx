import React, { useState } from "react";
import { ShieldCheck, Car, Music, Lightbulb, Home as HomeIcon, Lock, Star, MessageCircle, Image as ImageIcon, MapPin, Mail, ShoppingCart, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";

const servicios = [
  {
    titulo: "Polarizado Vehicular",
    descripcion: "Protege tu auto y mejora su estética.",
    imagen: "/img/polarizado.jpg",
    precio: "Desde $15.000",
    link: "/productos?cat=polarizado",
  },
  {
    titulo: "Alarmas y Seguridad",
    descripcion: "Alarmas y sistemas de seguridad para tu vehículo.",
    imagen: "/img/alarmas.jpg",
    precio: "Desde $20.000",
    link: "/productos?cat=alarmas",
  },
  {
    titulo: "Audio Car",
    descripcion: "Instalación profesional de audio y multimedia.",
    imagen: "/img/audio.jpg",
    precio: "Desde $18.000",
    link: "/productos?cat=audio",
  },
  // ...agrega más servicios
];

const Home = () => {
  // Estado para el formulario de contacto rápido
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes integrar EmailJS, Formspree o tu backend
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="bg-gray-100 py-12 px-4 max-w-7xl mx-auto space-y-16">
      {/* Header estilo Mercado Libre */}
      <header className="bg-yellow-400 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-ml.png" alt="KeyMaxProt" className="h-8" />
            <span className="font-bold text-lg text-gray-900">KeyMaxProt</span>
          </Link>
          <form className="flex-1 mx-4 max-w-xl">
            <div className="flex bg-white rounded shadow px-2 py-1">
              <input
                type="text"
                placeholder="Buscar productos, servicios..."
                className="flex-1 px-2 py-1 outline-none bg-transparent"
              />
              <button type="submit" className="text-gray-500 hover:text-gray-700">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
          <Link to="/carrito" className="relative ml-4">
            <ShoppingCart className="w-6 h-6 text-gray-800" />
            {/* Aquí puedes poner el contador de productos */}
          </Link>
          <button className="ml-4 md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Barra de navegación */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex gap-4 px-4 py-2 overflow-x-auto">
          <Link to="/productos" className="text-sm text-gray-700 font-medium hover:text-yellow-600">Marketplace</Link>
          <Link to="/contacto" className="text-sm text-gray-700 font-medium hover:text-yellow-600">Contacto</Link>
          {/* ...más categorías */}
        </div>
      </nav>

      {/* Banner principal */}
      <section className="bg-gradient-to-r from-yellow-300 to-yellow-100 py-8 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">¡Bienvenido a KeyMaxProt!</h1>
        <p className="text-lg text-gray-700 mb-4">Todo para tu seguridad, confort y personalización automotriz y residencial.</p>
        <Link
          to="/productos"
          className="inline-block bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded shadow hover:bg-yellow-400 transition"
        >
          Ver productos y servicios
        </Link>
      </section>

      {/* Sección de servicios estilo cards Mercado Libre */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Nuestros servicios destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {servicios.map((serv) => (
            <div key={serv.titulo} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
              <img src={serv.imagen} alt={serv.titulo} className="w-full h-32 object-cover rounded mb-3" />
              <h3 className="font-semibold text-lg text-gray-900">{serv.titulo}</h3>
              <p className="text-gray-600 text-sm mb-2">{serv.descripcion}</p>
              <span className="text-yellow-600 font-bold mb-2">{serv.precio}</span>
              <Link
                to={serv.link}
                className="mt-auto inline-block bg-yellow-400 text-gray-900 font-semibold px-4 py-1 rounded hover:bg-yellow-300 transition"
              >
                Ver más
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Puedes agregar aquí secciones horizontales tipo "Visto recientemente", "Te puede interesar", etc. */}

      {/* Footer simple */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KeyMaxProt. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Home;