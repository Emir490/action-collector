import Layout from "@/components/layout";
import Image from "next/image";
import alphabetImg from "@/images/abecedario.png";
import Link from "next/link";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Yo",
  "Hola",
  "Amor"
];

const Learning = () => {

  return (
    <Layout>
      <div className="flex flex-col items-center">
        {/* Utilizar componente Image para mostrar imagenes */}
        <Image
          src={alphabetImg}
          alt="Abecedario Imagen"
          width={200}
          height={200}
        />
        <p className="bg-orange-400 shadow-md mt-2 text-white p-3 rounded-md font-medium">
          Aprendiendo Señas
        </p>
        {/* Utilizando clases de TailwindCSS para acomodar los botones por columna y demás */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-4 w-full h-auto px-4">
          {/* Utilizar .map cuando se quiera mostrar componentes dinamicamente */}
          {alphabet.map((letter) => (
            <Link
              key={letter}
              href={`/learning/${letter}`}
              className="bg-orange-400 hover:bg-orange-500 border-0 shadow-md text-sm sm:text-base text-white text-center rounded-lg px-3 py-2.5 font-medium"
            >
              {letter}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Learning;
