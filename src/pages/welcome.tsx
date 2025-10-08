import CardSwap, { Card } from '@/components/CardSwap';
import Image from 'next/image';
import Aurora from '@/components/Aurora';
import TextRotator from '@/components/TextRotator';

export default function Welcome() {
  const letters = Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ');

  const getLetterFile = (letter: string) => {
    const letterMap: { [key: string]: string } = {
      'A': 'A.svg', 'B': 'B.svg', 'C': 'c.svg', 'D': 'd.svg', 'E': 'e.svg', 'F': 'f.svg', 'G': 'g.svg', 'H': 'h.svg', 'I': 'i.svg', 'J': 'j.svg', 'K': 'k.svg', 'L': 'l.svg', 'M': 'm.svg', 'N': 'n.svg', 'Ñ': 'nn.svg', 'O': 'o.svg', 'P': 'p.svg', 'Q': 'q.svg', 'R': 'r.svg', 'S': 's.svg', 'T': 't.svg', 'U': 'u.svg', 'V': 'v.svg', 'W': 'w.svg', 'X': 'x.svg', 'Y': 'y.svg', 'Z': 'z.svg'
    };
    return letterMap[letter];
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
      {/* Efecto Aurora como fondo */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Aurora
          colorStops={["#EA5A0C", "#FF8C42", "#FFB366"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      
      {/* Layout con dos columnas */}
      <div style={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Columna izquierda - Logo fijo y textos rotativos */}
        <div style={{ 
          width: '50%', 
          position: 'relative',
          padding: '60px',
          background: 'linear-gradient(to right, rgba(26, 26, 26, 0.8), rgba(26, 26, 26, 0.3), transparent)'
        }}>
          {/* Logo - Posición fija absoluta */}
          <div style={{ 
            position: 'absolute',
            top: '60px',
            left: '60px',
            zIndex: 10
          }}>
            <Image 
              src="/signaitext-white.svg" 
              alt="SignAI Text Logo" 
              width={280} 
              height={94} 
              style={{ height: 'auto', width: '280px' }}
            />
          </div>
          
          {/* Contenedor para textos que rotan - Posicionado debajo del logo */}
          <div style={{
            position: 'absolute',
            top: '200px', // Posición fija debajo del logo
            left: '60px',
            right: '60px'
          }}>
            <TextRotator />
          </div>
        </div>
        
        {/* Columna derecha - Contenido principal */}
        <div style={{ 
          width: '50%', 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center',
          height: '100vh',
          paddingLeft: '120px'
        }}>
          <CardSwap cardDistance={80} verticalDistance={150} delay={2800} pauseOnHover={false} width={580} height={580}>
            {letters.map((letter, idx) => {
              const svgFile = getLetterFile(letter);
              return (
                <Card key={idx}>
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <div style={{ width: 380, height: 380, borderRadius: 24, background: 'rgba(234, 90, 12, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                      {svgFile ? (
                        <Image src={`/Abecedario/${svgFile}`} alt={`Letra ${letter} en LSM`} width={380} height={380} style={{ width: 360, height: 360, objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: 120, color: '#fff', fontWeight: 800 }}>{letter}</span>
                      )}
                    </div>
                    <span style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>{letter}</span>
                  </div>
                </Card>
              );
            })}
          </CardSwap>
        </div>
      </div>
    </div>
  );
}
