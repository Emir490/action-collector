import Image from 'next/image';
import Aurora from '@/components/Aurora';
import TextRotator from '@/components/TextRotator';

export default function Welcome() {

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
      
      {/* Layout principal */}
      <div style={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Contenido principal - Logo fijo y textos rotativos */}
        <div style={{ 
          width: '100%', 
          position: 'relative',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Logo y QR - Centrado */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '50px',
            marginBottom: '60px'
          }}>
            <Image 
              src="/GOD.svg" 
              alt="GOD Logo" 
              width={280} 
              height={94} 
              style={{ height: 'auto', width: '280px' }}
            />
            <Image 
              src="/qr.jpeg" 
              alt="QR Code" 
              width={280} 
              height={280} 
              style={{ height: '280px', width: '280px', objectFit: 'contain' }}
            />
          </div>
          
          {/* Contenedor para textos que rotan */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TextRotator />
          </div>
        </div>
      </div>
    </div>
  );
}
