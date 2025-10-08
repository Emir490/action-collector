import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Hand, MessageSquare, Gamepad2, BookOpen, PlusCircle, Download, Menu, GraduationCap } from 'lucide-react';
import { getAllActions, IActions } from "@/helpers";

const actionsData: IActions[] = getAllActions();

const extractCategories = (actions: IActions[]): string[] => {
  const categories: string[] = actions.map((action) => action.category);
  return [...new Set(categories)];
};

const categories = extractCategories(actionsData);

export default function MenuPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
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

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <select
              className="w-full p-3 bg-orange-700 text-white rounded-lg font-semibold border border-orange-600"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {actionsInCategory.length > 0 && (
            <div className="mb-4">
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  const firstAction = actionsInCategory[0];
                  router.push({
                    pathname: `/menu/${firstAction}/add`,
                    query: { category: selectedCategory, action: firstAction }
                  });
                }}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Añadir Señas
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {actionsInCategory.map((action, index) => (
              <Card 
                key={index}
                className="bg-orange-700/50 border-orange-600 hover:bg-orange-600/50 transition-all duration-300 cursor-pointer group"
                onClick={() => router.push({
                  pathname: `/menu/${action}`,
                  query: { category: selectedCategory, action: action }
                })}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500/30 group-hover:bg-orange-500/50 transition-all duration-300 flex-shrink-0">
                    <Hand className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-orange-100 group-hover:text-white transition-colors font-medium capitalize">
                    {action}
                  </p>
                </CardContent>
              </Card>
            ))}
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

            <h3 className="text-lg font-semibold text-orange-100 mb-4">Abecedario LSM</h3>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-2 gap-2 pb-4">
              {Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ').map((letter, index) => {
                const getLetterFile = (letter: string) => {
                  const letterMap: { [key: string]: string } = {
                    'A': 'A.svg',
                    'B': 'B.svg', 
                    'C': 'c.svg',
                    'D': 'd.svg',
                    'E': 'e.svg',
                    'F': 'f.svg',
                    'G': 'g.svg',
                    'H': 'h.svg',
                    'I': 'i.svg',
                    'J': 'j.svg',
                    'K': 'k.svg',
                    'L': 'l.svg',
                    'M': 'm.svg',
                    'N': 'n.svg',
                    'Ñ': 'nn.svg',
                    'O': 'o.svg',
                    'P': 'p.svg',
                    'Q': 'q.svg',
                    'R': 'r.svg',
                    'S': 's.svg',
                    'T': 't.svg',
                    'U': 'u.svg',
                    'V': 'v.svg',
                    'W': 'w.svg',
                    'X': 'x.svg',
                    'Y': 'y.svg',
                    'Z': 'z.svg'
                  };
                  return letterMap[letter];
                };
                
                const svgFile = getLetterFile(letter);
                
                return (
                  <Card 
                    key={index}
                    className="bg-orange-600/30 border-orange-500/50 hover:bg-orange-500/50 transition-all duration-300 cursor-pointer group aspect-square"
                  >
                    <CardContent className="p-3 flex flex-col items-center justify-center gap-2 h-full">
                      <div className="w-16 h-16 flex items-center justify-center bg-orange-400/20 group-hover:bg-orange-400/30 transition-all duration-300 rounded">
                        {svgFile ? (
                          <Image
                            src={`/Abecedario/${svgFile}`}
                            alt={`Letra ${letter} en LSM`}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="text-xl font-bold text-orange-400 group-hover:text-white transition-all duration-300">
                            {letter.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-center text-orange-200 group-hover:text-white transition-colors font-medium">
                        {letter.toUpperCase()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <main className="hidden lg:flex lg:flex-1 lg:flex-col lg:p-6 lg:pl-80 lg:pr-6 lg:h-screen lg:overflow-hidden">
        <div className="flex flex-col h-full gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Diccionario LSM</h1>
                <p className="text-orange-100">Categoría: <span className="text-white font-semibold">{selectedCategory}</span></p>
              </div>
              {actionsInCategory.length > 0 && (
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    const firstAction = actionsInCategory[0];
                    router.push({
                      pathname: `/menu/${firstAction}/add`,
                      query: { category: selectedCategory, action: firstAction }
                    });
                  }}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Añadir Señas
                </Button>
              )}
            </div>
            
            {/* Selector de categorías para desktop */}
            <div className="mb-4">
              <select
                className="w-full max-w-md p-3 bg-orange-700 text-white rounded-lg font-semibold border border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-3 pb-4">
              {actionsInCategory.map((action, index) => (
                <Card 
                  key={index}
                  className="bg-orange-700/50 border-orange-600 hover:bg-orange-600/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push({
                    pathname: `/menu/${action}`,
                    query: { category: selectedCategory, action: action }
                  })}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-500/30 group-hover:bg-orange-500/50 transition-all duration-300 flex-shrink-0">
                      <Hand className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-base text-orange-100 group-hover:text-white transition-colors font-medium capitalize">
                      {action}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}