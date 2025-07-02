import React from 'react';
import { Outlet } from 'react-router-dom';
import ImprovedNavigation from '../ImprovedNavigation'; // Tu barra de navegación

const MainLayout = () => {
  return (
    <div>
      <ImprovedNavigation />
      <main>
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
      {/* Aquí puedes poner un Footer común */}
    </div>
  );
};
export default MainLayout;