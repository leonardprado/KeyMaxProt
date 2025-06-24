import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartContext } from "../contexts/CartContext";

const Navbar = () => {
  const location = useLocation();
  const { items } = useCartContext();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  const navLinks = [
    { to: "/productos", label: "Marketplace" },
    { to: "/contacto", label: "Contacto" },
    {
      to: "/carrito",
      label: (
        <span className="relative flex items-center">
          <ShoppingCart className="inline w-5 h-5 mr-1" />
          Carrito
          <span
            className={`absolute -top-2 -right-3 bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow transition-all duration-300
              ${
                totalItems > 0
                  ? "scale-100 opacity-100 animate-bounce"
                  : "scale-0 opacity-0"
              }
            `}
          >
            {totalItems > 0 && totalItems}
          </span>
        </span>
      ),
    },
  ];

  return (
    <nav className="backdrop-blur bg-slate-900/80 shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 tracking-tight drop-shadow
            transition-transform duration-300 hover:scale-105 hover:drop-shadow-lg"
        >
          KeyMaxProt
        </Link>
        <div className="flex gap-2 items-center">
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.to}>
              <Link
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 shadow-sm
                  ${
                    location.pathname.startsWith(link.to)
                      ? "bg-orange-500 text-white shadow-orange-200"
                      : "text-slate-200 hover:bg-slate-800 hover:text-white hover:shadow-md"
                  }
                `}
              >
                {link.label}
              </Link>
              {idx < navLinks.length - 1 && (
                <span className="h-5 w-px bg-gradient-to-b from-orange-400 to-yellow-400 opacity-60 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;