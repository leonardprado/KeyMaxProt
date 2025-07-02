import React from 'react';
import { Outlet } from 'react-router-dom';
import ImprovedNavigation from '../ImprovedNavigation'; // Tu barra de navegación
import Footer from '../Footer'; // Importa el componente Footer

const MainLayout = () => {
  return (
    <div>
      <ImprovedNavigation />
      <main>
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
      <Footer /> {/* Añade el componente Footer aquí */}
    </div>
  );
};
export default MainLayout;