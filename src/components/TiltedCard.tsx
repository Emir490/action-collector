import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './TiltedCard.module.css';

interface TiltedCardProps {
  imageSrc: string;
  altText: string;
  captionText: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayContent?: React.ReactNode;
}

const TiltedCard: React.FC<TiltedCardProps> = ({
  imageSrc,
  altText,
  captionText,
  containerHeight = "300px",
  containerWidth = "300px",
  imageHeight = "300px",
  imageWidth = "300px",
  rotateAmplitude = 12,
  scaleOnHover = 1.2,
  showMobileWarning = false,
  showTooltip = true,
  displayOverlayContent = true,
  overlayContent
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const rotateX = mousePosition.y * rotateAmplitude;
  const rotateY = -mousePosition.x * rotateAmplitude;

  return (
    <div 
      className={styles.tiltedCardFigure}
      style={{ 
        height: containerHeight, 
        width: containerWidth 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      {showMobileWarning && (
        <div className={styles.tiltedCardMobileAlert}>
          Hover effect works best on desktop
        </div>
      )}
      
      <motion.div
        className={styles.tiltedCardInner}
        style={{ 
          height: imageHeight, 
          width: imageWidth 
        }}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <Image
          src={imageSrc}
          alt={altText}
          width={parseInt(imageWidth)}
          height={parseInt(imageHeight)}
          className={styles.tiltedCardImg}
          style={{
            height: imageHeight,
            width: imageWidth
          }}
        />
        
        {displayOverlayContent && overlayContent && (
          <div className={`${styles.tiltedCardOverlay} opacity-100`}>
            {overlayContent}
          </div>
        )}
        
        {showTooltip && (
          <motion.div
            className={`${styles.tiltedCardCaption} opacity-100`}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{ duration: 0.2 }}
          >
            {captionText}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TiltedCard;
