import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Hand, MessageSquare, Gamepad2, BookOpen, PlusCircle, Download, Menu, GraduationCap } from 'lucide-react';
import { getAllActions, IActions } from "@/helpers";
import AnimatedList from '@/components/AnimatedList';

const actionsData: IActions[] = getAllActions();

const extractCategories = (actions: IActions[]): string[] => {
  const categories: string[] = actions.map((action) => action.category);
  return [...new Set(categories)];
};

const categories = extractCategories(actionsData);

export default function MenuPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const check = () => setIsMobile(window.innerWidth < 1024);
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }
  }, []);
  useEffect(() => {
    if (isMobile) {
      setSelectedCategory('');
    }
  }, [isMobile]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Encontrar la categoría seleccionada y obtener sus acciones
  const currentCategoryData = actionsData.find(cat => cat.category === selectedCategory);
  const actionsInCategory = currentCategoryData ? currentCategoryData.actions : [];

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
                className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600"
                onClick={() => {
                  setShowMobileMenu(false);
                }}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Contribuir
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/learning');
                }}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Diccionario LSM
              </h1>
              <p className="text-orange-200 text-sm">
                Contribuye al crecimiento del diccionario de Lengua de Señas Mexicana
              </p>
            </div>

            {/* Mobile step flow with transitions */}
            <AnimatePresence mode="wait">
              {isMobile && (!selectedCategory || selectedCategory === '') ? (
                <motion.div
                  key="mobile-categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <h2 className="text-lg font-semibold text-orange-100 text-center">Selecciona una categoría</h2>
                  <AnimatedList
                    items={categories}
                    onItemSelect={(category) => setSelectedCategory(category)}
                    showGradients={false}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                    className="h-full"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {actionsInCategory.length > 0 && (
                    <div className="flex justify-center">
                      <Button 
                        className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => {
                          const firstAction = actionsInCategory[0];
                          router.push({
                            pathname: `/menu/${firstAction}/add`,
                            query: { category: selectedCategory, action: firstAction, autoStart: 'true' }
                          });
                        }}
                      >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Añadir Señas
                      </Button>
                    </div>
                  )}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-orange-100 text-center">
                      Acciones en {selectedCategory}
                    </h2>
                    <AnimatedList
                      items={actionsInCategory}
                      onItemSelect={(action, index) => router.push({
                        pathname: `/menu/${action}/add`,
                        query: { category: selectedCategory, action: action, autoStart: 'true' }
                      })}
                      showGradients={false}
                      enableArrowNavigation={true}
                      displayScrollbar={true}
                      className="h-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                className="w-full bg-orange-700 hover:bg-orange-600 justify-start text-white border-2 border-orange-500"
                onClick={() => {}}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Contribuir
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/learning')}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <main className="hidden lg:flex lg:flex-1 lg:flex-col lg:p-8 lg:pl-80 lg:pr-8 lg:h-screen lg:overflow-hidden">
        <div className="flex flex-col h-full gap-6">
          {/* Header Section Desktop */}
          <div className="flex-shrink-0 text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Diccionario LSM
            </h1>
            <p className="text-orange-200 text-lg max-w-2xl mx-auto">
              Contribuye al crecimiento del diccionario de Lengua de Señas Mexicana
            </p>
          </div>

          {/* Layout de dos columnas */}
          <div className="flex-1 flex gap-8 min-h-0">
            {/* Primera columna - Categorías */}
            <div className="w-1/3 flex flex-col">
              <div className="flex-shrink-0 mb-6 ml-4">
                <h2 className="text-2xl font-semibold text-orange-100 mb-4">
                  Categorías
                </h2>
                <p className="text-orange-200/70 text-sm">
                  Selecciona una categoría para ver sus acciones
                </p>
              </div>
              
              <div className="flex-1">
                <AnimatedList
                  items={categories.map(category => `${category} (${actionsData.find(cat => cat.category === category)?.actions.length || 0} acciones)`)}
                  onItemSelect={(item, index) => setSelectedCategory(categories[index])}
                  showGradients={true}
                  enableArrowNavigation={true}
                  displayScrollbar={true}
                  initialSelectedIndex={categories.indexOf(selectedCategory)}
                  className="h-full"
                />
              </div>
            </div>

            {/* Segunda columna - Subcategorías (Acciones) */}
            <div className="w-2/3 flex flex-col">
              <div className="flex-shrink-0 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-orange-100 mb-2">
                      Acciones en <span className="text-white font-bold">{selectedCategory}</span>
                    </h2>
                    <p className="text-orange-200/70">
                      {actionsInCategory.length} acciones disponibles
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <AnimatedList
                  items={actionsInCategory}
                  onItemSelect={(action, index) => router.push({
                    pathname: `/menu/${action}/add`,
                    query: { category: selectedCategory, action: action, autoStart: 'true' }
                  })}
                  showGradients={true}
                  enableArrowNavigation={true}
                  displayScrollbar={true}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}