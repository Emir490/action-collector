import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout"
import { ActionsProvider } from "@/context/ActionsProvider";
import useActions from "@/hooks/useActions";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {
    const [toggle, setToggle] = useState(false);

    const { videos } = useActions();

    return (
        <Layout>
            <div className="container mx-auto">
                <div className={`flex ${toggle ? 'justify-end' : 'justify-center'}`}>
                    <button className="bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors" onClick={() => setToggle(!toggle)}>{toggle ? "Apagar Cámara" : "Encencer Cámara"}</button>
                </div>
                {toggle && <HolisticComponent />}
                
            </div>
            <div>
                { videos.map(vide => (
                    <video src={vide.video}></video>
                )) }
            </div>
            <ToastContainer />
        </Layout>
    )
}

export default Add