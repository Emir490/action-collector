import CategoriesList from '@/components/categoriesList';
import Layout from '@/components/layout';
import List from '@/components/list';
import { ActionsProvider } from '@/context/ActionsProvider';
import useActions from '@/hooks/useActions';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaPlusCircle } from 'react-icons/fa';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Gamepad2, BookOpen, Menu, GraduationCap, Hand } from 'lucide-react';
import { useState } from 'react';

const Actions = () => {
    const router = useRouter();
    const category = router.query.category;
    const action = router.query.action;
    const menu = router.query.menu;
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
                                className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600"
                                onClick={() => {
                                    setShowMobileMenu(false);
                                    router.push('/menu');
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
                    {menu ? (
                        <CategoriesList />
                    ) : (
                        <>
                            <div className="grid place-items-center min-h-screen w-full p-0 relative z-20">
                                <Link href={{ pathname: `${action}/add`, query: { action, category } }} className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-bold uppercase text-white inline-flex items-center gap-x-2 rounded-lg shadow-lg hover:shadow-xl relative z-30">
                                    <FaPlusCircle className="w-4 h-4 align-middle" color="#FFF" />
                                    <span className="align-middle leading-none">Añadir Señas</span>
                                </Link>
              </div>
                            <List />
                        </>
            )}
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
                onClick={() => router.push('/menu')}
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

            {/* Contenido principal con margen para sidebar */}
            <div className="flex-1 lg:ml-80">
                {menu ? (
                    <CategoriesList />
                ) : (
                    <>
                        <div className="grid place-items-center min-h-screen w-full p-0 relative z-20">
                            <Link href={{ pathname: `${action}/add`, query: { action, category } }} className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-bold uppercase text-white inline-flex items-center gap-x-2 rounded-lg shadow-lg hover:shadow-xl relative z-30">
                                <FaPlusCircle className="w-4 h-4 align-middle" color="#FFF" />
                                <span className="align-middle leading-none">Añadir Señas</span>
                            </Link>
                    </div>
                        <List />
                    </>
            )}
          </div>
    </div>
  );
};

export default Actions;