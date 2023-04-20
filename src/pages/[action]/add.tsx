import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout"
import useActions from "@/hooks/useActions";
import { useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import ReactPlayer from "react-player";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {
    const [toggle, setToggle] = useState(false);
    const [offCanvas, setOffCanvas] = useState(false);
    const [playingId, setPlayingId] = useState<Number>();

    const { videos, setVideos } = useActions();

    return (
        <Layout>
            <div className='container mx-auto'>
                <div className={`flex ${toggle ? 'justify-end' : 'justify-center'}`}>
                    <button className="bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors" onClick={() => setToggle(!toggle)}>{toggle ? "Apagar Cámara" : "Encencer Cámara"}</button>
                </div>
                {toggle && <HolisticComponent />}
            </div>
            <button className="fixed right-0 top-0 p-4 bg-indigo-500 text-white rounded-l-full z-20" onClick={() => setOffCanvas(!offCanvas)}>Videos</button>
            <div className={`fixed right-0 top-0 h-full bg-indigo-800 w-1/5 transform transition-transform ease-in-out duration-300 overflow-y-auto scrollbar-thin scrollbar-corner-indigo-900 scrollbar-track-slate-900 scrollbar-thumb-slate-600 ${offCanvas ? 'translate-x-0' : 'translate-x-full'}`}>
                {videos.map(videoObj => (
                    <div key={videoObj.id} className="relative m-5">
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
                                    setVideos(prevVideos => prevVideos.filter(videoState => videoState.id !== videoObj.id))
                                }}
                            />
                        </button>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </Layout>
    )
}

export default Add