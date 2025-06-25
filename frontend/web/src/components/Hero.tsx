import { Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const images = [
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background text-foreground pt-20 pb-12 md:pt-28 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-black"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                KeymaxProt
              </span>
              <span className="block text-foreground/90">Tu Especialista en Personalización Vehicular</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Transformamos tu vehículo con servicios de polarizado, alarmas, audio, e iluminación de última generación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" variant="secondary" className="font-semibold px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 mr-3" />
                Agendar Cita
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-transform"
                onClick={() => window.location.href = '/marketplace'}
              >
                Ver Marketplace
              </Button>
            </div>
          </div>

          <div className="relative h-64 md:h-80 lg:h-96 w-full max-w-lg mx-auto lg:max-w-none lg:justify-self-end">
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-border h-full">
              <div className="relative h-full w-full" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease-in-out' }}>
                {images.map((src, index) => (
                  <img key={index} src={src} alt={`Slide ${index + 1}`} className="absolute top-0 left-0 w-full h-full object-cover" style={{ left: `${index * 100}%` }} />
                ))}
              </div>
            </div>
            <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-4 bg-background/40 text-foreground p-2 rounded-full hover:bg-background/60 transition-colors z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-4 bg-background/40 text-foreground p-2 rounded-full hover:bg-background/60 transition-colors z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? 'bg-foreground' : 'bg-foreground/40'} transition-colors`}></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
