import Layout from "@/components/layout";
import Image from "next/image";
import alphabetImg from "@/images/abecedario.png";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Hand, MessageSquare, Gamepad2, BookOpen, Menu, GraduationCap } from 'lucide-react';

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Yo",
  "Hola",
  "Amor"
];

const Learning = () => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil */}
      <div className="lg:hidden flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 bg-orange-600/80 backdrop-blur-sm border-b border-orange-700">
          <div className="flex items-center gap-2">
            <Image 
              src="/signaitext-white.svg" 
              alt="SignAI Text Logo" 
              width={120} 
              height={40} 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:bg-orange-700"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-16 left-4 right-4 z-20 bg-orange-700/95 backdrop-blur-sm border border-orange-600 rounded-lg shadow-lg">
            <div className="p-4 space-y-2">
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/');
                }}
              >
                <Hand className="w-5 h-5 mr-3" />
                Abecedario LSM
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/action');
                }}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Acción
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/play?autoStart=true');
                }}
              >
                <Gamepad2 className="w-5 h-5 mr-3" />
                Jugar
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/menu');
                }}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Contribuir
              </Button>
              <Button
                className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600"
                onClick={() => {
                  setShowMobileMenu(false);
                }}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col items-center">
            {/* Utilizar componente Image para mostrar imagenes */}
            <Image
              src={alphabetImg}
              alt="Abecedario Imagen"
              width={200}
              height={200}
            />
            <p className="bg-orange-400 shadow-md mt-2 text-white p-3 rounded-md font-medium">
              Aprendiendo Señas
            </p>
            {/* Grid optimizado para mostrar todas las letras bien */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-6 w-full max-w-2xl mx-auto px-4">
              {alphabet.map((letter) => (
                <Link
                  key={letter}
                  href={`/learning/${letter}`}
                  className="bg-orange-400 hover:bg-orange-500 border-0 shadow-md text-white text-center rounded-lg font-medium aspect-square flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg min-h-[48px] text-sm sm:text-base"
                >
                  <span className="truncate px-1">{letter}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:h-screen lg:bg-orange-600/90 lg:border-r lg:border-orange-700 lg:overflow-hidden lg:fixed lg:left-0 lg:top-0">
        <div className="p-6 border-b border-orange-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <Image 
              src="/signaitext-white.svg" 
              alt="SignAI Text Logo" 
              width={160} 
              height={54} 
              className="h-12 w-auto"
            />
          </div>
          <p className="text-orange-100 text-sm">Por un México Incluyente</p>
        </div>

        <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold text-orange-100 mb-4">Modo de Reconocimiento</h3>
            <div className="space-y-3 mb-6">
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/')}
              >
                <Hand className="w-5 h-5 mr-3" />
                Abecedario LSM
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/action')}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Acción
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/play')}
              >
                <Gamepad2 className="w-5 h-5 mr-3" />
                Jugar
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/menu')}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Contribuir
              </Button>
              <Button 
                className="w-full bg-orange-700 hover:bg-orange-600 justify-start text-white border-2 border-orange-500"
                onClick={() => {}}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:pl-80 lg:h-screen lg:overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center py-8 px-6">
            {/* Utilizar componente Image para mostrar imagenes */}
            <Image
              src={alphabetImg}
              alt="Abecedario Imagen"
              width={200}
              height={200}
              className="mb-4"
            />
            <h1 className="bg-orange-400 shadow-md text-white px-6 py-3 rounded-lg font-semibold text-xl mb-8">
              Aprendiendo Señas
            </h1>
            
            {/* Grid optimizado para desktop */}
            <div className="grid grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-4 w-full max-w-6xl mx-auto">
              {alphabet.map((letter) => (
                <Link
                  key={letter}
                  href={`/learning/${letter}`}
                  className="bg-orange-400 hover:bg-orange-500 border-0 shadow-md text-white text-center rounded-lg font-medium aspect-square flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg min-h-[60px] text-lg group"
                >
                  <span className="truncate px-2 group-hover:font-bold transition-all duration-200">
                    {letter}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* Información adicional */}
            <div className="mt-12 text-center max-w-2xl">
              <p className="text-orange-200 text-lg mb-4">
                Selecciona una letra para aprender su seña correspondiente en Lengua de Señas Mexicana (LSM)
              </p>
              <div className="bg-orange-600/30 rounded-lg p-4 border border-orange-500/50">
                <p className="text-orange-100 text-sm">
                  <strong>Tip:</strong> Cada letra tiene su propia seña única. Practica regularmente para mejorar tu fluidez en LSM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
