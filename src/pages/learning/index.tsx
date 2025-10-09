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
                  router.push('/mobile');
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="relative">
                <Image
                  src={alphabetImg}
                  alt="Abecedario Imagen"
                  width={240}
                  height={240}
                  className="mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Aprendiendo Señas
                </h1>
                <p className="text-orange-200 text-sm max-w-md mx-auto">
                  Explora el abecedario en Lengua de Señas Mexicana
                </p>
              </div>
            </div>

            {/* Alphabet Grid */}
            <div className="w-full max-w-4xl">
              <h2 className="text-xl font-semibold text-orange-100 mb-4 text-center">
                Selecciona una letra
              </h2>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {alphabet.map((letter, index) => (
                  <Link
                    key={letter}
                    href={`/learning/${letter}`}
                    className="group relative bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-center rounded-xl font-semibold aspect-square flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-orange-500/25 min-h-[56px] text-sm sm:text-base border border-orange-300/20"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <span className="truncate px-2 group-hover:font-bold transition-all duration-200">
                      {letter}
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 max-w-md mx-auto">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <p className="text-orange-100 text-sm leading-relaxed">
                  <strong className="text-orange-200">Tip:</strong> Cada letra tiene su propia seña única. Practica regularmente para mejorar tu fluidez en LSM.
                </p>
              </div>
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
                onClick={() => router.push('/mobile')}
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
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          <div className="flex flex-col items-center py-12 px-8 space-y-12">
            {/* Hero Section Desktop */}
            <div className="text-center space-y-6">
              <div className="relative">
                <Image
                  src={alphabetImg}
                  alt="Abecedario Imagen"
                  width={280}
                  height={280}
                  className="mx-auto rounded-3xl shadow-2xl"
                />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Aprendiendo Señas
                </h1>
                <p className="text-orange-200 text-xl max-w-2xl mx-auto leading-relaxed">
                  Explora el abecedario completo en Lengua de Señas Mexicana
                </p>
              </div>
            </div>
            
            {/* Alphabet Grid Desktop */}
            <div className="w-full max-w-7xl">
              <h2 className="text-2xl font-semibold text-orange-100 mb-8 text-center">
                Selecciona una letra para comenzar
              </h2>
              <div className="grid grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-4">
                {alphabet.map((letter, index) => (
                  <Link
                    key={letter}
                    href={`/learning/${letter}`}
                    className="group relative bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-center rounded-2xl font-semibold aspect-square flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/30 min-h-[72px] text-lg border border-orange-300/20 hover:border-orange-300/40"
                    style={{
                      animationDelay: `${index * 30}ms`
                    }}
                  >
                    <span className="truncate px-3 group-hover:font-bold transition-all duration-200">
                      {letter}
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Info Section Desktop */}
            <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8 max-w-4xl mx-auto">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-orange-100">
                    Consejos para aprender LSM
                  </h3>
                  <p className="text-orange-200 text-lg leading-relaxed">
                    Cada letra tiene su propia seña única. Practica regularmente para mejorar tu fluidez en Lengua de Señas Mexicana. 
                    <span className="block mt-2 text-orange-300 font-medium">
                      ¡La práctica constante es la clave del éxito!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
