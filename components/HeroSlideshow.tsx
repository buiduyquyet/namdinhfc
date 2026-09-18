"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const SLIDES = [
  { src: "/cover-bg.jpg", alt: "Cầu thủ Nam Định cùng nâng cúp trong niềm vui chiến thắng" },
  { src: "/thientruong-stadium-team.jpg", alt: "Đội bóng Nam Định trên sân Thiên Trường" },
  { src: "/cdv-1.jpg", alt: "Sắc xanh trên khán đài cổ động viên Nam Định" },
];
const INTERVAL = 8000;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(MOTION_QUERY).matches;
const getServerReducedMotion = () => true;

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const loadedSlides = useRef(new Set<number>());
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerReducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % SLIDES.length;
      if (!document.hidden && loadedSlides.current.has(nextIndex)) {
        setActiveIndex(nextIndex);
      }
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [activeIndex, reducedMotion]);

  return (
    <div className="home-hero-slideshow" data-reduced-motion={reducedMotion}>
      <div className="home-hero-slides" aria-hidden="true">
        {SLIDES.map((slide, index) => (
          <div key={slide.src} className="home-hero-slide" data-active={index === activeIndex}>
            <Image
              src={slide.src} alt="" fill sizes="100vw"
              priority={index === 0} loading={index === 0 ? undefined : "eager"}
              className="home-hero-image"
              onLoad={() => loadedSlides.current.add(index)}
            />
          </div>
        ))}
      </div>
      <div className="home-hero-shade" aria-hidden="true" />
      <div className="home-hero-controls-wrap">
        <div className="container">
          <div className="home-hero-controls" role="group" aria-label="Điều khiển ảnh nền">
            <div className="home-hero-dots">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.src} type="button" className="home-hero-dot"
                  aria-label={`Ảnh ${index + 1}: ${slide.alt}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                >
                  <span />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
