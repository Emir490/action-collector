import { useState } from "react";
import { signs } from "@/helpers";
import Slider from "react-slick";
import Image from "next/image";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    vertical: true,
    verticalSwiping: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const toggleCarousel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleCarousel}
        className="fixed top-20 right-4 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out"
      >
        {isOpen ? "✖" : "☰"}
      </button>
      {isOpen && (
        <div className="fixed top-24 right-4 w-80 h-1/4 bg-white shadow-xl rounded-lg z-40 overflow-hidden transition-transform transform origin-top-right">
          <Slider {...settings} className="h-full">
            {signs.map((sign, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 h-full">
                <div className="w-full h-full flex justify-center items-center">
                  <Image
                    src={sign?.img}
                    alt={`${sign?.name} Seña`}
                    width={300}
                    height={300}
                    className="rounded-lg shadow-lg object-cover w-full h-full"
                  />
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-800 text-center">{sign.name}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg cursor-pointer"
      onClick={onClick}
    >
      ↓
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg cursor-pointer"
      onClick={onClick}
    >
      ↑
    </div>
  );
};

export default Carousel;
