
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Contact from '../components/Contact';
import FAQ from '../components/FAQ';
import ImprovedNavigation from '../components/ImprovedNavigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <Hero />
      <Services />
      <About />
      <FAQ />
      <Contact />
    </div>
  );
};

export default Index;
