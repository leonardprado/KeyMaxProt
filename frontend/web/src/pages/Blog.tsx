import ImprovedNavigation from '@/components/ImprovedNavigation';
import { ShieldCheckIcon, MagnifyingGlassIcon, WrenchScrewdriverIcon, ShoppingCartIcon, BookOpenIcon, ChatBubbleBottomCenterTextIcon, ArrowRightIcon, CpuChipIcon, UserGroupIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/solid';






const Blog = () => {
  
  const colors = {
    primary: 'indigo-600',
    primaryHover: 'indigo-700',
    darkBg: 'slate-900',
    lightBg: 'slate-800',
    accent: 'emerald-400',
    textPrimary: 'white',
    textSecondary: 'slate-300',
  };

  return (
   
    <div className={`bg-${colors.darkBg} ${colors.textPrimary} font-sans`}>
     <ImprovedNavigation />
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center p-8 overflow-hidden">
       
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black animate-gradient-xy"></div>
        <div className="relative z-10">
          
          <SparklesIcon className={`w-16 h-16 mx-auto mb-4 text-${colors.accent}`} />
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            El Ecosistema Completo para tu Vehículo y tu Carrera.
          </h1>
          <p className={`mt-4 max-w-3xl mx-auto text-lg md:text-xl ${colors.textSecondary}`}>
            Desde el mantenimiento y la compra de repuestos, hasta la formación profesional. Todo en un solo lugar.
          </p>

          <div className="mt-10 max-w-xl mx-auto">
            <label htmlFor="verification" className="block text-sm font-medium mb-2">Verificación Rápida de Confianza</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                id="verification"
                placeholder="Ingresa patente o ID de cliente..."
                className="flex-grow bg-slate-800 border border-slate-700 rounded-md py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
              <button className={`bg-${colors.primary} hover:bg-${colors.primaryHover} rounded-md px-6 py-3 font-semibold flex items-center justify-center gap-2 transition duration-300`}>
                <ShieldCheckIcon className="w-5 h-5" />
                Verificar
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <section className={`bg-${colors.lightBg} py-20 px-8`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <ShoppingCartIcon className="w-12 h-12 mb-4 text-indigo-400" />
            <h3 className="text-2xl font-bold">Marketplace Confiable</h3>
            <p className={`mt-2 ${colors.textSecondary}`}>Compra y vende repuestos y accesorios con la seguridad de nuestra comunidad verificada.</p>
          </div>
          <div className="flex flex-col items-center">
            <WrenchScrewdriverIcon className="w-12 h-12 mb-4 text-indigo-400" />
            <h3 className="text-2xl font-bold">Gestión y Servicios</h3>
            <p className={`mt-2 ${colors.textSecondary}`}>Agenda citas, lleva un registro digital de cada mantenimiento y accede a promociones exclusivas.</p>
          </div>
          <div className="flex flex-col items-center">
            <BookOpenIcon className="w-12 h-12 mb-4 text-indigo-400" />
            <h3 className="text-2xl font-bold">Aprende y Crece</h3>
            <p className={`mt-2 ${colors.textSecondary}`}>Accede a tutoriales de expertos, conéctate con otros profesionales y eleva tus habilidades.</p>
          </div>
        </div>
      </section>

      
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">Creado para Ti, Seas Quien Seas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
          
            <div className={`bg-${colors.lightBg} p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300`}>
              <UserGroupIcon className="w-10 h-10 mb-4 text-emerald-400"/>
              <h3 className="text-2xl font-bold mb-2">Para Propietarios</h3>
              <p className={`${colors.textSecondary} mb-6`}>Toma el control total de tu vehículo. Simple, digital y en tu bolsillo.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center"><Checkmark /> Historial de mantenimiento digital.</li>
                <li className="flex items-center"><Checkmark /> Garantías y comprobantes en la nube.</li>
                <li className="flex items-center"><Checkmark /> Acceso a descuentos y promociones.</li>
              </ul>
              <a href="#" className={`text-${colors.accent} font-semibold inline-flex items-center`}>Empieza a registrar tu auto <ArrowRightIcon className="w-4 h-4 ml-2"/></a>
            </div>

         
            <div className={`bg-${colors.lightBg} p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300`}>
              <RocketLaunchIcon className="w-10 h-10 mb-4 text-emerald-400"/>
              <h3 className="text-2xl font-bold mb-2">Para Profesionales</h3>
              <p className={`${colors.textSecondary} mb-6`}>Expande tu negocio, consigue más clientes y gestiona tu trabajo eficientemente.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center"><Checkmark /> Publica tus servicios y productos.</li>
                <li className="flex items-center"><Checkmark /> Conecta con una base de clientes más amplia.</li>
                <li className="flex items-center"><Checkmark /> Herramientas para fidelizar a tu clientela.</li>
              </ul>
              <a href="#" className={`text-${colors.accent} font-semibold inline-flex items-center`}>Únete como profesional <ArrowRightIcon className="w-4 h-4 ml-2"/></a>
            </div>

            <div className={`bg-${colors.lightBg} p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300`}>
              <CpuChipIcon className="w-10 h-10 mb-4 text-emerald-400"/>
              <h3 className="text-2xl font-bold mb-2">Para Aprendices</h3>
              <p className={`${colors.textSecondary} mb-6`}>Convierte tu pasión en tu profesión con recursos de primer nivel.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center"><Checkmark /> Cursos y tutoriales de expertos.</li>
                <li className="flex items-center"><Checkmark /> Comunidad de mensajería para resolver dudas.</li>
                <li className="flex items-center"><Checkmark /> Oportunidades para conectar con talleres.</li>
              </ul>
              <a href="#" className={`text-${colors.accent} font-semibold inline-flex items-center`}>Empieza a aprender hoy <ArrowRightIcon className="w-4 h-4 ml-2"/></a>
            </div>
            
          </div>
        </div>
      </section>

     
      <section className="py-20 px-8">
        <div className={`max-w-5xl mx-auto bg-gradient-to-r from-${colors.primary} to-indigo-800 rounded-2xl p-12 text-center`}>
            <h2 className="text-3xl md:text-4xl font-extrabold">¿Listo para Unirte a la Revolución del Automotor?</h2>
            <p className="mt-4 text-lg text-indigo-200">Descarga la aplicación y descubre una nueva forma de vivir tu pasión por los vehículos.</p>
            <div className="mt-8 flex justify-center gap-4">
                <button className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">Descargar App</button>
                <button className="bg-transparent border-2 border-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-transform">Contactar a Ventas</button>
            </div>
        </div>
      </section>
      
      
      <footer className={`bg-${colors.lightBg} border-t border-slate-700 py-12 px-8`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-4">KeyMaxProt</h4>
            <p className={`${colors.textSecondary}`}>© {new Date().getFullYear()} Todos los derechos reservados.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Producto</h4>
            <ul className={`space-y-2 ${colors.textSecondary}`}>
              <li><a href="#" className="hover:text-white">Marketplace</a></li>
              <li><a href="#" className="hover:text-white">Servicios</a></li>
              <li><a href="#" className="hover:text-white">Tutoriales</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Compañía</h4>
            <ul className={`space-y-2 ${colors.textSecondary}`}>
              <li><a href="#" className="hover:text-white">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-white">Carreras</a></li>
              <li><a href="#" className="hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className={`space-y-2 ${colors.textSecondary}`}>
              <li><a href="#" className="hover:text-white">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};


const Checkmark = () => (
  <svg className="w-6 h-6 mr-2 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);


export default Blog;