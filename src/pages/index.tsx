import Layout from "@/components/layout";
import GestureRecognition from "@/components/gestureRecognition";
import Carousel from "@/components/carousel";
import Image from "next/image";
import Icon from "@/images/icon.png";

export default function Home() {
  return (
    <Layout>
      <section className="my-8 px-4 sm:px-8 lg:px-52">
        <div className="flex flex-col items-center sm:flex-row sm:items-start mb-6">
          <Image src={Icon} alt="Icono SignAI" width={64} height={64} className="mb-4 sm:mb-0 sm:mr-4" />
          <p className="text-lg sm:text-xl text-justify">
            Sign AI es una aplicación que permite al usuario manejar el lenguaje de señas mexicano con el fin de facilitar su comunicación o aprendizaje. El proyecto se enfoca en abordar la barrera de comunicación que enfrentan las personas con discapacidad auditiva al desarrollar un sistema de reconocimiento del lenguaje de señas mexicano.
          </p>
        </div>
        <p className="text-lg sm:text-xl pb-10 text-justify">
          A continuación se presenta un módulo donde puede realizar y capturar señas, solo tiene que presionar el botón de “Encender” la cámara y comenzar a realizar señas libremente. Si es que quiere borrar la seña que ha capturado, presione el botón de “Borrar” la seña, y si es que quiere borrar toda la cadena, presione el botón de “Reiniciar” la captura.
        </p>
      </section>
      <GestureRecognition />
      <Carousel />
    </Layout>
  );
}
