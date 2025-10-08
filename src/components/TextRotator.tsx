import { useState, useEffect } from 'react';

const TextRotator = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [animateChars, setAnimateChars] = useState(false);
  
  const texts = [
    {
      title: "Rompe el esquema de la comunicación",
      subtitle: "Por un México incluyente",
      description: "La comunicación se convierte en un derecho, no en un privilegio"
    },
    {
      title: "Acción",
      subtitle: "Reconocimiento en tiempo real",
      description: "Detecta y traduce gestos de manera instantánea"
    },
    {
      title: "Contribución",
      subtitle: "Ayuda a mejorar el sistema",
      description: "Agrega nuevas señas y mejora la precisión"
    },
    {
      title: "Aprendizaje",
      subtitle: "Domina la lengua de señas",
      description: "Practica y aprende nuevas señas paso a paso"
    },
    {
      title: "Traducción en tiempo real",
      subtitle: "Comunicación instantánea",
      description: "Convierte señas en texto y viceversa al instante"
    }
  ];

  // Función para dividir texto en caracteres
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="split-char"
        style={{
          position: 'relative',
          display: 'inline-block',
          opacity: animateChars ? 1 : 0,
          transform: animateChars ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, 20px, 0px)',
          transition: `opacity 0.3s ease-out ${index * 0.02}s, transform 0.3s ease-out ${index * 0.02}s`
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Fade out
      setIsVisible(false);
      setAnimateChars(false);
      
      // Cambiar texto después del fade out
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        // Fade in
        setIsVisible(true);
        // Animar caracteres
        setTimeout(() => {
          setAnimateChars(true);
        }, 100);
      }, 300); // 300ms para el fade out
      
    }, 7000); // Cambia cada 7 segundos

    // Animar caracteres iniciales
    setTimeout(() => {
      setAnimateChars(true);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const currentText = texts[currentTextIndex];

  return (
    <div style={{ marginBottom: '40px' }}>
      <div
        key={currentTextIndex}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: '400', 
          color: '#fff', 
          marginBottom: '24px',
          lineHeight: '1.1',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Figtree, sans-serif'
        }}>
          {splitText(currentText.title)}
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#FFB366', 
          marginBottom: '16px',
          fontWeight: '500',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          minHeight: '28px',
          fontFamily: 'Figtree, sans-serif'
        }}>
          {currentText.subtitle}
        </p>
        <p style={{ 
          fontSize: '18px', 
          color: '#FF8C42', 
          fontWeight: '400',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          minHeight: '22px',
          fontFamily: 'Figtree, sans-serif'
        }}>
          {currentText.description}
        </p>
      </div>
    </div>
  );
};

export default TextRotator;
