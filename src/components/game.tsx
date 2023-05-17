import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from 'react';

const source = '../../public/build';

const Game = () => {
    const [isClient, setIsClient] = useState(false);
    const { unityProvider } = useUnityContext({
        loaderUrl: `../../public/build/SL.loader.js`,
        dataUrl: `../../public/build/webgl.data`,
        frameworkUrl: `../../public/build/build.framework.js`,
        codeUrl: `../../public/build/build.wasm`
    });

    // This will only run on the client, so we can use it to set a flag which indicates whether we're on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // If we're not on the client, don't render anything
    if (!isClient) {
        return null;
    }

    return <Unity unityProvider={unityProvider} />;
}

export default Game;