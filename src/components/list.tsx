import { useState } from "react";
import useActions from "@/hooks/useActions";
import { FaTrash, FaPlay } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPlayer from "react-player";

const List = () => {
  const [playingId, setPlayingId] = useState("");

  const { actions, removeAction } = useActions();

  const notify = () => toast.success("Eliminado exitosamente");

  return (
    <>
      <style jsx>
        {`
          .icon-wrapper:hover .icon {
            display: block;
          }
        `}
      </style>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions &&
          actions.map((action) => (
            <div
              key={action._id}
              className="mt-5 bg-indigo-950 p-5 rounded-lg hover:bg-indigo-900 transition-colors relative group"
            >
              <div className="icon-wrapper">
                <FaTrash
                  className="icon absolute top-3 right-4 hidden group-hover:block text-white hover:text-red-500 transition-colors hover:cursor-pointer z-10"
                  title="Eliminar"
                  size="1.3em"
                  onClick={() => {
                    removeAction(action._id);
                    notify();
                  }}
                />
              </div>
              <div className="relative inline-block">
                <ReactPlayer
                  url={`${action.video}`}
                  width="auto"
                  height="auto"
                  playing={action._id === playingId}
                  onEnded={() => setPlayingId("")}
                />
                {action._id !== playingId && (
                  <FaPlay
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-4xl cursor-pointer"
                    title="Play"
                    color="#FFF"
                    onClick={() => setPlayingId(action._id)}
                  />
                )}
              </div>
              <p className="text-white font-bold text-xl mt-3">
                {action.sequence}
              </p>
              <ToastContainer />
            </div>
          ))}
      </div>
    </>
  );
};

export default List;
