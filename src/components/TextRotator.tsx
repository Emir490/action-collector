import { useState, useEffect } from 'react';

const TextRotator = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [animateChars, setAnimateChars] = useState(false);
  
  const texts = [
    {
      title: "Rompe el esquema de la comunicación",
      subtitle: "",
      description: ""
    },
    {
      title: "Por un México incluyente",
      subtitle: "",
      description: ""
    },
    {
      title: "La comunicación se convierte en un derecho, no en un privilegio",
      subtitle: "",
      description: ""
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
          display: 'inline',
          opacity: animateChars ? 1 : 0,
          transform: animateChars ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, 20px, 0px)',
          transition: `opacity 0.3s ease-out ${index * 0.02}s, transform 0.3s ease-out ${index * 0.02}s`,
          whiteSpace: 'pre-wrap'
        }}
      >
        {char}
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
    <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
      <div
        key={currentTextIndex}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          textAlign: 'left',
          maxWidth: '90vw', // más ancho para que no se corte
        }}
      >
        <h1
          style={{
            fontSize: '100px',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '24px',
            lineHeight: '1.05',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            minHeight: '290px',
            display: 'block',
            fontFamily: 'Figtree, sans-serif',
            width: '100%',
            maxWidth: '90vw',
            whiteSpace: 'normal', // permite saltos naturales
            wordBreak: 'keep-all', // evita romper palabras
            overflowWrap: 'break-word', // asegura que se ajuste bien
            margin: '60px 0 0 0'
          }}
        >
          {splitText(currentText.title)}
        </h1>

        {currentText.subtitle && (
          <p
            style={{
              fontSize: '50px',
              color: '#FFB366',
              marginBottom: '16px',
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              minHeight: '28px',
              fontFamily: 'Figtree, sans-serif',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out 0.2s',
              maxWidth: '85vw',
              margin: '0',
              lineHeight: '0.9'
            }}
          >
            {currentText.subtitle}
          </p>
        )}

        {currentText.description && (
          <p
            style={{
              fontSize: '40px',
              color: '#FF8C42',
              fontWeight: '400',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              minHeight: '10px',
              fontFamily: 'Figtree, sans-serif',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out 0.4s',
              maxWidth: '80vw',
              margin: '0',
              lineHeight: '1.1'
            }}
          >
            {currentText.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextRotator;
