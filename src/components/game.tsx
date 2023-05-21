import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";
import useMobile from "@/hooks/useMobile";
import { Progress } from "flowbite-react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Game = () => {
  const [play, setPlay] = useState(false);
  const router = useRouter();

  const { unityProvider, isLoaded, loadingProgression, unload, requestFullscreen } =
    useUnityContext({
      loaderUrl: `/build/SL.loader.js`,
      dataUrl: `/build/webgl.data`,
      frameworkUrl: `/build/build.framework.js`,
      codeUrl: `/build/build.wasm`,
    });

  const isMobile = useMobile();

  const loadingPercentage = Math.round(loadingProgression * 100);

  const lockScreenToLandscape = async () => {
    try {
      await window.screen.orientation.lock('landscape');
    } catch (error) {
      console.error('Could not lock screen to landscape mode', error);
      toast.info('Hubo un error al querer entrar a pantalla completa');
    }
  }

  useEffect(() => {
    if (isMobile && isLoaded) {
      requestFullscreen(true);
      lockScreenToLandscape();
    }
  }, [isLoaded]);

  useEffect(() => {
    const handleRouteChange = async () => {
      await unload();
    }

    if (isLoaded) {
      router.events.on('routeChangeStart', handleRouteChange);
    }
  }, [router, isLoaded, unload])

  const handleFullScreen = () => {
    requestFullscreen(true);
  };

  return (
    <>
      {isMobile ? (
        <>
          <button
            className="p-3 bg-indigo-700 hover:bg-indigo-800 transition-colors text-white rounded-lg w-full uppercase font-bold"
            onClick={() => setPlay(true)}
          >
            Jugar
          </button>
          {play && !isLoaded && (
            <Progress progress={loadingPercentage} size='lg' />
          )}
          {play && <Unity unityProvider={unityProvider} />}
        </>
      ) : (
        <>
          {!isLoaded && (
            <Progress progress={loadingPercentage} size='lg' />
          )}
          <button
            className="p-3 bg-indigo-700 text-white rounded-lg mb-5"
            onClick={handleFullScreen}
          >
            Pantalla Completa
          </button>
          <div className="w-full flex justify-center">
            <Unity
              style={{ width: "100%", height: "90vh" }}
              unityProvider={unityProvider}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Game;
