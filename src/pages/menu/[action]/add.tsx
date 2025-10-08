import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout";
import useActions from "@/hooks/useActions";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import ReactPlayer from "react-player";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Hand, MessageSquare, Gamepad2, BookOpen, Menu, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const numberSequences = 50; // You can set the desired number of sequences here.

const Add = () => {
  const [toggle, setToggle] = useState(false);
  const [offCanvas, setOffCanvas] = useState(false);
  const [playingId, setPlayingId] = useState<Number>();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const videosRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { videos, setVideos } = useActions();

  const handleDownload = () => {
    if (videos.length != numberSequences) {
      toast.error(`Deben ser ${numberSequences} secuencias.`)
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
  }

  useEffect(() => {
    if (videosRef.current) {
      videosRef.current.scrollTo(0, videosRef.current.scrollHeight);
    }
  }, [videos])

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      {/* Sidebar */}
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

      {/* Contenido principal con margen para sidebar */}
      <div className="flex-1 lg:ml-80">
        {/* Header móvil */}
        <div className="lg:hidden">
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
        </div>

        <div className="container mx-auto">
        <div className={`flex ${toggle ? "justify-end" : "justify-center"}`}>
          <button
            className="bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? "Apagar Cámara" : "Encender Cámara"}
          </button>
        </div>
        {toggle && <HolisticComponent />}
      </div>
      <button
        className={`fixed right-0 top-0 p-4 bg-indigo-300 font-bold rounded-l-full z-20 ${offCanvas ? 'text-rose-500' : 'text-white'}`}
        onClick={() => setOffCanvas(!offCanvas)}
      >
        {offCanvas ? 'X' : 'Videos'}
      </button>
      <div
        ref={videosRef}
        className={`fixed right-0 top-0 h-full bg-indigo-800 w-1/5 transform transition-transform ease-in-out duration-300 overflow-y-auto scrollbar-thin scrollbar-corner-indigo-900 scrollbar-track-slate-900 scrollbar-thumb-slate-600 ${
          offCanvas ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex sticky top-0 z-10">
        <button
            className={`text-white uppercase font-bold mx-auto mt-5 bg-indigo-950 p-3 rounded-lg hover:bg-indigo-400 transition-colors`}
            onClick={handleDownload}
            >
            Descargar acciones
            </button>

        </div>
        {videos.map((videoObj, index) => (
          <div key={videoObj.id} className={`relative m-5 ${index === 0 ? 'mt-5' : ''}`}>
            <ReactPlayer
              url={`${videoObj.video}`}
              width="auto"
              height="auto"
              playing={videoObj.id === playingId}
              onEnded={() => setPlayingId(0)}
            />
            {videoObj.id !== playingId && (
              <FaPlay
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-4xl cursor-pointer"
                title="Play"
                color="#FFF"
                onClick={() => setPlayingId(videoObj.id)}
              />
            )}
            <button className="absolute top-1 right-1 p-2 text-white">
              <FaTrash
                className={`hover:text-red-500 transition-colors`}
                title="Eliminar"
                size="1.3em"
                onClick={() => {
                  setVideos((prevVideos) =>
                    prevVideos.filter(
                      (videoState) => videoState.id !== videoObj.id
                    )
                  );
                  console.log(videos.length);
                }}
              />
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
      </div>
    </div>
  );
};

export default Add;