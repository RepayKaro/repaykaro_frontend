'use client';

import React, { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';

type CarouselProps = {
  images: string[];
  autoSlideInterval?: number;
};

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoSlideInterval = 3000
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
 const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
  loop: true,
  slides: {
    perView: 2,
    spacing: 8, // Optional: adjust spacing as needed
  },
  breakpoints: {
    "(max-width: 768px)": {
      slides: {
        perView: 1,
        spacing: 4, // Optional: reduce spacing on small screens
      },
    },
  },
  slideChanged(slider) {
    setCurrentSlide(slider.track.details.rel);
  },
});

  // Auto-slide effect
  useEffect(() => {
    if (!instanceRef.current) return;

    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [instanceRef, autoSlideInterval]);

  // Group images into pairs for 2-per-slide
  const imagePairs = [];
  for (let i = 0; i < images.length; i += 1) {
    imagePairs.push(images.slice(i, i + 1));
  }

  return (
    <div className=" relative group">
      <div ref={sliderRef} className="keen-slider">
        {imagePairs.map((pair, pairIndex) => (
          <div key={pairIndex} className="keen-slider__slide">
            <div className="flex gap-4"> {/* Container for the image pair */}
              {pair.map((src, imgIndex) => (
                <div key={imgIndex} className="relative flex-3 aspect-[2.5]">
                  <Image
                    src={src}
                    alt={`Slide ${pairIndex}-${imgIndex}`}
                    fill
                    className="object-cover rounded-lg"
                   
                  />
                </div>

              ))}
              {/* Fill empty space if odd number of images */}
              {pair.length === 1 && (
                <div className="flex-1" /> // Empty space filler
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots - now based on pairs */}
      <div className="flex justify-center mt-4 gap-2">
        {imagePairs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${currentSlide === idx ? 'bg-blue-600' : 'bg-gray-300'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;