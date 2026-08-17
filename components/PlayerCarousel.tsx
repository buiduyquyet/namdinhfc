"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import type { Player } from "@/data/players";

const AUTOPLAY_INTERVAL = 4500;

/**
 * Bề rộng một bước cuộn = khoảng cách giữa 2 slide liền nhau.
 * Đo trực tiếp từ DOM thay vì tính tay vì số slide mỗi khung đổi theo breakpoint.
 */
function getStep(track: HTMLElement): number {
  const [first, second] = Array.from(track.children) as HTMLElement[];
  if (!first) return 0;
  return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
}

interface PlayerCarouselProps {
  players: Player[];
}

const PlayerCarousel = ({ players }: PlayerCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  /** Vị trí cuộn xa nhất, tính theo bước. `0` nghĩa là mọi slide đã vừa khung — khỏi cần điều hướng. */
  const [maxIndex, setMaxIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: getStep(track) * index, behavior: "smooth" });
  }, []);

  const scrollByStep = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    // Chạm mép thì vòng lại đầu / cuối để carousel không bị "kẹt"
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    const atStart = track.scrollLeft <= 1;

    if (direction === 1 && atEnd) return track.scrollTo({ left: 0, behavior: "smooth" });
    if (direction === -1 && atStart) {
      return track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    }

    track.scrollBy({ left: getStep(track) * direction, behavior: "smooth" });
  }, []);

  // Đồng bộ dot đang active theo vị trí cuộn thật (kể cả khi người dùng tự vuốt)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const step = getStep(track);
      if (step > 0) setActiveIndex(Math.round(track.scrollLeft / step));
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  // Số slide hiển thị cùng lúc đổi theo breakpoint nên phải đo lại mỗi khi khung đổi kích thước
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const step = getStep(track);
      if (step <= 0) return;
      setMaxIndex(Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step)));
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [players.length]);

  useEffect(() => {
    if (isPaused || maxIndex === 0) return;
    // Tôn trọng cài đặt giảm chuyển động của hệ điều hành
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => scrollByStep(1), AUTOPLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [isPaused, maxIndex, scrollByStep]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* py-3 chừa chỗ cho hiệu ứng nhấc card khi hover, tránh bị overflow cắt mất */}
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3"
      >
        {players.map((player, index) => (
          <Link
            key={player.id}
            href={`/squad/${player.slug}`}
            className="snap-start shrink-0 basis-[85%] sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)] xl:basis-[calc((100%-4.5rem)/4)] no-underline text-inherit"
          >
            <PlayerCard player={player} index={index} />
          </Link>
        ))}
      </div>

      {maxIndex > 0 && (
        <>
          <CarouselArrow direction="prev" onClick={() => scrollByStep(-1)} />
          <CarouselArrow direction="next" onClick={() => scrollByStep(1)} />

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Tới nhóm cầu thủ ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-6 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface CarouselArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
}

const CarouselArrow = ({ direction, onClick }: CarouselArrowProps) => {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Cầu thủ trước" : "Cầu thủ tiếp theo"}
      className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white text-secondary shadow-lg border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors ${
        isPrev ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points={isPrev ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
      </svg>
    </button>
  );
};

export default PlayerCarousel;
