import Layout from "@/components/layout";
import Image from "next/image";
import React from "react";
import alphabetImg from "@/images/A.jpg";

const Index = () => {
  const buttonStyle = {
    fontSize: "25px",
    borderRadius: "10%", // Ajusta el nivel de redondez aquí
    boxShadow: "0 1px 6px 3px #e68019" // Ajusta el nivel de sombra aquí
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen mt-[-80px]">
        <div className="shadow-lg">
          <Image
            src={alphabetImg}
            alt="Abecedario Imagen"
            width={300}
            height={250}
          />
        </div>
        <p className="text-5xl font-bold mt-16 text-black">
          LETRA A
        </p>
        <p className="text-2xl mt-6 text-orange-500 text-justify border-t-4 border-b-4 border-orange-500 py-1">
          Con la mano cerrada, se muestran las uñas y se estira el dedo pulgar hacia un lado. La palma mira al este.
        </p>
        <div className="w-80 h-60 bg-orange-400 mt-10 rounded-lg shadow-lg flex items-center justify-center">
          <button
            className="text-white bg-orange-500 hover:bg-orange-600 py-5 px-5"
            style={buttonStyle}
          >
            Inténtalo
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;