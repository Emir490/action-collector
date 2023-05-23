import Layout from '@/components/layout';
import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';

const alfabeto = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'LL', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'RR', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function Learning() {
  const botonesPorFila = 3;
  const [abecedarioImage, setAbecedarioImage] = useState<string>('');

  useEffect(() => {
    setAbecedarioImage('/images/abecedario.png');
  }, []);

  const renderBotones = () => {
    const filas: JSX.Element[] = [];

    for (let i = 0; i < alfabeto.length; i += botonesPorFila) {
      const fila: JSX.Element[] = [];

      for (let j = 0; j < botonesPorFila; j++) {
        const index = i + j;
        if (index < alfabeto.length) {
          fila.push(
            <Button key={alfabeto[index]} className="bg-orange-400" style={{ margin: '7px', width: '110px', boxShadow: '0px 2px 4px rgba(255, 153, 35, 0.4)' }}>
              {alfabeto[index]}
            </Button>
          );
        }
      }

      filas.push(
        <div key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '13px' }}>
          {fila}
        </div>
      );
    }

    return filas;
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: '-30px' }}>
        {abecedarioImage && (
          <img src={abecedarioImage} style={{ width: '200px', marginBottom: '10px' }} />
        )}
        <Button className="bg-orange-400" style={{ boxShadow: '0px 2px 4px rgba(255, 153, 35, 0.4)' }}>Aprendiendo Letras</Button>
        {renderBotones()}
      </div>
    </Layout>
  );
}

export default Learning;
