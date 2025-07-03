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
      perView: 2, // Show 2 slides at a time
      spacing: 15, // Add gap between slides
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
  for (let i = 0; i < images.length; i += 2) {
    imagePairs.push(images.slice(i, i + 2));
  }

  return (
    <div className="w-full relative group">
      <div ref={sliderRef} className="keen-slider">
        {imagePairs.map((pair, pairIndex) => (
          <div key={pairIndex} className="keen-slider__slide">
            <div className="flex gap-4"> {/* Container for the image pair */}
              {pair.map((src, imgIndex) => (
                <div key={imgIndex} className="relative flex-1 h-[300px]">
                  <Image
                    src={src}
                    alt={`Slide ${pairIndex}-${imgIndex}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 50vw, 25vw"
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
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === idx ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;