import Layout from "@/components/layout";
import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/router";
import { signs } from "@/helpers";
import SignRecognition from "@/components/signRecognition";

const Sign: FC = () => {
  const router = useRouter();
  
  const signAction = router.query.sign;

  const sign = signs.find((sign) => sign.name === signAction); 
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <div className="shadow-lg">
          <Image
            src={sign?.img}
            alt={`${sign?.name} Seña`}
            width={150}
            height={200}
          />
        </div>
        <p className="text-5xl font-bold mt-16 text-black uppercase">Letra {sign?.name}</p>
        <p className="text-2xl mt-6 text-orange-500 text-justify border-t-4 border-b-4 border-orange-500 py-1">
          {sign?.description}
        </p>
        { sign?.name && <SignRecognition sign={sign.name} /> }
      </div>
    </Layout>
  );
};

export default Sign;
