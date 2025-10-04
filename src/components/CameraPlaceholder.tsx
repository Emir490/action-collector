import { Camera } from 'lucide-react';
import { useRef } from 'react';
import Webcam from 'react-webcam';

interface CameraPlaceholderProps {
  isCamera?: boolean;
  webcamRef?: React.RefObject<Webcam>;
  children?: React.ReactNode;
}

export default function CameraPlaceholder({ isCamera = false, webcamRef, children }: CameraPlaceholderProps) {
  if (isCamera && webcamRef) {
    return (
      <div className="relative w-full h-full">
        <Webcam
          mirrored
          ref={webcamRef}
          className="rounded-lg w-full h-full object-cover"
          screenshotFormat="image/jpeg"
        />
        {children}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative rounded-lg border border-neutral-700 overflow-hidden">
      {/* Animated Detection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-pulse"></div>
      
      {/* Camera Frame */}
      <div className="absolute inset-8 border-2 border-dashed border-neutral-500 rounded-lg opacity-40" />
      <div className="absolute inset-16 border border-dashed border-neutral-600 rounded-md opacity-30" />
      
      {/* Animated Detection Lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Camera Icon and Text */}
      <div className="flex flex-col items-center gap-4 text-neutral-300 relative z-10">
        <div className="relative">
          <Camera className="w-16 h-16 lg:w-24 lg:h-24 text-neutral-400" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg lg:text-xl font-medium text-neutral-200">Vista de Cámara</p>
          <p className="text-sm lg:text-base text-neutral-400">Coloca tus manos en el área de detección</p>
        </div>
      </div>

      {/* Detection Status */}
      <div className="absolute bottom-6 left-6">
        <div className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-full border border-green-500/30 backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">Analizando...</span>
        </div>
      </div>

      {/* Corner Indicators */}
      <div className="absolute top-4 left-4 w-6 h-6 lg:w-8 lg:h-8 border-l-2 border-t-2 border-green-500 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-6 h-6 lg:w-8 lg:h-8 border-r-2 border-t-2 border-green-500 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-6 h-6 lg:w-8 lg:h-8 border-l-2 border-b-2 border-green-500 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-6 h-6 lg:w-8 lg:h-8 border-r-2 border-b-2 border-green-500 rounded-br-lg" />
    </div>
  );
}

