import Layout from "@/components/layout";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { signs } from "@/helpers";
import SignRecognition from "@/components/signRecognition";
import TiltedCard from "@/components/TiltedCard";

const Sign: FC = () => {
  const router = useRouter();
  const [sign, setSign] = useState<any>(null);
  
  useEffect(() => {
    if (router.isReady && router.query.sign) {
      const signAction = router.query.sign;
      const foundSign = signs.find((s) => s.name === signAction);
      setSign(foundSign);
      console.log('signAction:', signAction);
      console.log('sign found:', foundSign);
    }
  }, [router.isReady, router.query.sign]);
  
  if (!router.isReady || !sign) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-8">
          <div className="text-xl">Cargando...</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-8">
        <div className="mb-8">
          <TiltedCard
            imageSrc={sign.img}
            altText={`${sign.name} Seña`}
            captionText={`Letra ${sign.name}`}
            containerHeight="400px"
            containerWidth="400px"
            imageHeight="400px"
            imageWidth="400px"
            rotateAmplitude={15}
            scaleOnHover={1.1}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <div className="absolute inset-0 flex flex-col justify-end">
                <div className="bg-gradient-to-t from-black via-black/90 to-black/50 p-8 rounded-b-2xl w-full h-3/4">
                  <div className="text-center w-full h-full flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-white mb-8">Letra {sign.name}</h2>
                    <p className="text-orange-300 text-xl leading-relaxed w-full px-4">{sign.description}</p>
                  </div>
                </div>
              </div>
            }
          />
        </div>
        
        <div className="mt-8">
          <SignRecognition sign={sign.name} />
        </div>
      </div>
    </Layout>
  );
};

export default Sign;
