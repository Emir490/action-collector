import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout";
import useActions from "@/hooks/useActions";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import ReactPlayer from "react-player";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const numberSequences = 50; // You can set the desired number of sequences here.

const Add = () => {
  const [toggle, setToggle] = useState(false);
  const [offCanvas, setOffCanvas] = useState(false);
  const [playingId, setPlayingId] = useState<Number>();

  const videosRef = useRef<HTMLDivElement>(null);

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
    <Layout>
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
    </Layout>
  );
};

export default Add;
