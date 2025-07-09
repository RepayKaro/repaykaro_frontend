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
  autoSlideInterval = 3000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Track screen width
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: isMobile ? 1 : 2,
      spacing: 15,
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

  return (
    <div className="relative group">
      <div ref={sliderRef} className="keen-slider">
        {images.map((src, index) => (
          <div key={index} className="keen-slider__slide">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
              <Image
                src={src}
                alt={`Slide ${index}`}
                fill
                className="object-contain sm:object-cover rounded-lg"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, idx) => (
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
