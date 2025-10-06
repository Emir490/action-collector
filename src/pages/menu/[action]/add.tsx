import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Hand, MessageSquare, Gamepad2, BookOpen, Download, Play, Trash2, ArrowLeft } from "lucide-react";
import HolisticComponent from "@/components/holisticComponent";
import useActions from "@/hooks/useActions";
import ReactPlayer from "react-player";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const numberSequences = 50;

export default function AddPage() {
  const router = useRouter();
  const { category, action } = router.query;
  
  const [toggle, setToggle] = useState(false);
  const [offCanvas, setOffCanvas] = useState(false);
  const [playingId, setPlayingId] = useState<Number>();

  const videosRef = useRef<HTMLDivElement>(null);
  const { videos, setVideos } = useActions();

  const handleDownload = () => {
    if (videos.length != numberSequences) {
      toast.error(`Deben ser ${numberSequences} secuencias.`);
      return;
    }

    const newVideos = videos.map(({ video, ...rest }) => rest);

    const json = JSON.stringify(newVideos);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${videos[0].action}.json`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (videosRef.current) {
      videosRef.current.scrollTo(0, videosRef.current.scrollHeight);
    }
  }, [videos]);

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
            <h1 className="text-2xl font-bold mb-2">Añadir Señas</h1>
            <p className="text-orange-100 text-sm">Categoría: <span className="text-white font-semibold">{category}</span></p>
            <p className="text-orange-100 text-sm">Acción: <span className="text-white font-semibold capitalize">{action}</span></p>
          </div>

          <div className="space-y-4">
            <Button
              className={`w-full ${toggle ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
            onClick={() => setToggle(!toggle)}
          >
              <Camera className="w-5 h-5 mr-2" />
            {toggle ? "Apagar Cámara" : "Encender Cámara"}
            </Button>

            {toggle && (
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <HolisticComponent />
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

            <h3 className="text-lg font-semibold text-orange-100 mb-4">Acerca de Añadir Señas</h3>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4 pb-4">
              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">📹 Grabación</h4>
                  <p className="text-xs text-orange-200">Graba {numberSequences} secuencias de la seña para entrenar el modelo.</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">💾 Descarga</h4>
                  <p className="text-xs text-orange-200">Una vez completadas las {numberSequences} secuencias, descarga el archivo JSON.</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">📊 Progreso</h4>
                  <p className="text-xs text-orange-200">{videos.length}/{numberSequences} secuencias grabadas</p>
                  <div className="w-full bg-orange-900/50 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(videos.length / numberSequences) * 100}%` }}
                    ></div>
                  </div>
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
                <h1 className="text-3xl font-bold mb-2">Añadir Señas</h1>
                <p className="text-orange-100">Categoría: <span className="text-white font-semibold">{category}</span> | Acción: <span className="text-white font-semibold capitalize">{action}</span></p>
              </div>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => router.push('/menu')}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Diccionario
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex gap-4">
            <div className="flex-1 flex flex-col gap-4">
              <Button
                className={`w-full ${toggle ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                onClick={() => setToggle(!toggle)}
              >
                <Camera className="w-5 h-5 mr-2" />
                {toggle ? "Apagar Cámara" : "Encender Cámara"}
              </Button>

              {toggle && (
                <div className="flex-1 bg-neutral-800 rounded-lg overflow-hidden">
                  <HolisticComponent />
                </div>
              )}
            </div>

            {/* Panel lateral de videos */}
            <div className="w-80 flex flex-col gap-4">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleDownload}
                disabled={videos.length !== numberSequences}
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar Acciones
              </Button>

              <div
                ref={videosRef}
                className="flex-1 overflow-y-auto space-y-3 bg-neutral-800 rounded-lg p-4"
              >
                {videos.length === 0 ? (
                  <div className="text-center text-orange-300 py-8">
                    <p>No hay videos grabados aún</p>
        </div>
                ) : (
                  videos.map((videoObj, index) => (
                    <div key={videoObj.id} className="relative bg-neutral-900 rounded-lg overflow-hidden">
            <ReactPlayer
              url={`${videoObj.video}`}
                        width="100%"
              height="auto"
              playing={videoObj.id === playingId}
              onEnded={() => setPlayingId(0)}
            />
            {videoObj.id !== playingId && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={() => setPlayingId(videoObj.id)}
                        >
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <button 
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                onClick={() => {
                  setVideos((prevVideos) =>
                    prevVideos.filter(
                      (videoState) => videoState.id !== videoObj.id
                    )
                  );
                }}
                      >
                        <Trash2 className="w-4 h-4 text-white" />
            </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
                        {index + 1}/{numberSequences}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
      </div>
      </main>

      <ToastContainer />
    </div>
  );
}
