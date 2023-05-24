import Layout from "@/components/layout";
import Image from "next/image";
import React, { FC } from "react";
import { useRouter } from "next/router";
import { signs } from "@/helpers";

const Sign: FC = () => {
  const router = useRouter();
  
  const signAction = router.query.sign;

  const sign = signs.find((sign) => sign.name === signAction); 
  console.log(sign);
  
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen mt-[-70px]">
        <div className="shadow-lg">
          <Image
            src={sign?.img}
            alt={`${sign?.name} Seña`}
            width={160}
            height={200}
          />
        </div>
        <p className="text-5xl font-bold mt-16 text-black uppercase">Letra {sign?.name}</p>
        <p className="text-2xl mt-6 text-orange-500 text-justify border-t-4 border-b-4 border-orange-500 py-1">
          {sign?.description}
        </p>
        <div className="w-80 h-60 bg-orange-400 mt-10 rounded-lg shadow-lg flex items-center justify-center">
          <button className="text-white bg-orange-500 hover:bg-orange-600 py-5 px-5 text-2xl rounded-lg shadow-orange-500">
            Inténtalo
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Sign;
