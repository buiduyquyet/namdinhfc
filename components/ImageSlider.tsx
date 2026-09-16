"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
  interval?: number;
  className?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  controlsClassName?: string;
  /** Chiều rộng hiển thị của ảnh, truyền cho `sizes` của next/image */
  sizes?: string;
}

const ImageSlider = ({
  images,
  interval = 5000,
  className = "",
  imageClassName = "",
  style,
  priority = false,
  controlsClassName = "",
  sizes = "100vw",
}: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            fill
            sizes={sizes}
            className={`object-cover ${imageClassName}`}
            priority={priority && index === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <div
          className={`absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 ${controlsClassName}`}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="flex h-8 w-8 items-center justify-center"
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={index === currentIndex}
              type="button"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "h-2.5 w-2.5 bg-white"
                    : "h-2 w-2 bg-white/55"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
