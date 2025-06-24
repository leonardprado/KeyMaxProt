
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Contact from '../components/Contact';
import ImprovedNavigation from '../components/ImprovedNavigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ImprovedNavigation />
      <Hero />
      <Services />
      <About />
      <Contact />
    </div>
  );
};

export default Index;
