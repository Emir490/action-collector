
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Hand, MessageSquare, Gamepad2, BookOpen, PlusCircle, Play, Trash2, ArrowLeft } from "lucide-react";
import useActions from "@/hooks/useActions";
import ReactPlayer from "react-player";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ActionPage() {
    const router = useRouter();
  const { category, action } = router.query;
  
  const [playingId, setPlayingId] = useState("");
  const { actions, removeAction } = useActions();

  const notify = () => toast.success("Eliminado exitosamente");

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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/menu')}
            className="text-white hover:bg-orange-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2 capitalize">{action}</h1>
            <p className="text-orange-100 text-sm">Categoría: <span className="text-white font-semibold">{category}</span></p>
          </div>

          <div className="mb-4">
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => router.push({
                pathname: `/menu/${action}/add`,
                query: { category, action }
              })}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Añadir Señas
            </Button>
          </div>

          <div className="space-y-4">
            {actions && actions.length > 0 ? (
              actions.map((actionItem) => (
                <Card 
                  key={actionItem._id}
                  className="bg-orange-700/50 border-orange-600 group relative overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="relative">
                      <ReactPlayer
                        url={`${actionItem.video}`}
                        width="100%"
                        height="auto"
                        playing={actionItem._id === playingId}
                        onEnded={() => setPlayingId("")}
                      />
                      {actionItem._id !== playingId && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                          onClick={() => setPlayingId(actionItem._id)}
                        >
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <button 
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() => {
                          removeAction(actionItem._id);
                          notify();
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <p className="text-white font-semibold mt-3">
                      Secuencia {actionItem.sequence}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-orange-300 py-8">
                <p>No hay secuencias grabadas para esta seña</p>
              </div>
            )}
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
          <p className="text-orange-100 text-sm">Por un México Inclusivo</p>
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
                Frases LSM
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
                Diccionario LSM
              </Button>
            </div>

            <h3 className="text-lg font-semibold text-orange-100 mb-4">Información de la Seña</h3>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4 pb-4">
              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">📝 Detalles</h4>
                  <p className="text-xs text-orange-200">Seña: <span className="font-semibold capitalize">{action}</span></p>
                  <p className="text-xs text-orange-200">Categoría: <span className="font-semibold">{category}</span></p>
                </CardContent>
              </Card>

              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">📊 Estadísticas</h4>
                  <p className="text-xs text-orange-200">Total de secuencias: <span className="font-semibold">{actions?.length || 0}</span></p>
                </CardContent>
              </Card>

              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">ℹ️ Instrucciones</h4>
                  <p className="text-xs text-orange-200">Puedes reproducir, eliminar o agregar nuevas secuencias de esta seña.</p>
                </CardContent>
              </Card>
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
                <h1 className="text-3xl font-bold mb-2 capitalize">{action}</h1>
                <p className="text-orange-100">Categoría: <span className="text-white font-semibold">{category}</span></p>
              </div>
              <div className="flex gap-3">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => router.push({
                    pathname: `/menu/${action}/add`,
                    query: { category, action }
                  })}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Añadir Señas
                </Button>
                <Button 
                  variant="outline"
                  className="border-orange-600 text-orange-100 hover:bg-orange-700"
                  onClick={() => router.push('/menu')}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {actions && actions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {actions.map((actionItem) => (
                  <Card 
                    key={actionItem._id}
                    className="bg-orange-700/50 border-orange-600 group relative overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="relative">
                        <ReactPlayer
                          url={`${actionItem.video}`}
                          width="100%"
                          height="auto"
                          playing={actionItem._id === playingId}
                          onEnded={() => setPlayingId("")}
                        />
                        {actionItem._id !== playingId && (
                          <div 
                            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                            onClick={() => setPlayingId(actionItem._id)}
                          >
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        )}
                        <button 
                          className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            removeAction(actionItem._id);
                            notify();
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <p className="text-white font-semibold mt-3">
                        Secuencia {actionItem.sequence}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="bg-orange-700/50 border-orange-600 max-w-md">
                  <CardContent className="p-8 text-center">
                    <Hand className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No hay secuencias</h3>
                    <p className="text-orange-200 mb-4">
                      Aún no hay secuencias grabadas para esta seña
                    </p>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => router.push({
                        pathname: `/menu/${action}/add`,
                        query: { category, action }
                      })}
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Agregar Primera Seña
                    </Button>
                  </CardContent>
                </Card>
                    </div>
            )}
          </div>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
