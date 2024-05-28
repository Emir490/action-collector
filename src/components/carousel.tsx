import { useState } from "react";
import { signs } from "@/helpers";
import Image from "next/image";
import React from "react";

const Carousel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCarousel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleCarousel}
        className="fixed top-20 right-4 z-50 p-3 bg-orange-400 hover:bg-orange-500 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out"
      >
        {isOpen ? "✖" : "☰"}
      </button>
      {isOpen && (
        <div className="fixed top-24 right-4 w-64 h-3/4 sm:w-80 bg-white shadow-xl rounded-lg z-40 overflow-y-auto">
          <div className="space-y-4 p-4">
            {signs.map((sign, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
                <Image
                  src={sign?.img}
                  alt={`${sign?.name} Seña`}
                  width={300}
                  height={300}
                  className="rounded-lg object-contain"
                />
                <p className="mt-4 text-lg font-semibold text-gray-800 text-center">{sign.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;
