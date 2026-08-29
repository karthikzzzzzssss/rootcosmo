import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Treatment } from '../types';
import TreatmentCard from './TreatmentCard';

interface TreatmentCarouselProps {
  treatments: Treatment[];
  onBook: (treatment: Treatment) => void;
}

export default function TreatmentCarousel({ treatments, onBook }: TreatmentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, treatments.length]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  if (treatments.length === 0) return null;

  return (
    <div className="relative group/carousel overflow-hidden">
      {/* Left arrow */}
      <button
        onClick={() => scrollByDir(-1)}
        disabled={!canLeft}
        aria-label="Scroll left"
        className={`absolute left-0 md:left-1 top-[88px] z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200
          ${canLeft ? 'opacity-0 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-purple-700 hover:text-white hover:border-purple-700 scale-100' : 'opacity-0 pointer-events-none scale-90'}`}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {treatments.map(t => (
          <div key={t.id} data-card className="flex h-auto w-[220px] min-w-[220px] flex-none snap-start">
            <TreatmentCard treatment={t} onBook={onBook} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scrollByDir(1)}
        disabled={!canRight}
        aria-label="Scroll right"
        className={`absolute right-0 md:right-1 top-[88px] z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200
          ${canRight ? 'opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-purple-700 hover:text-white hover:border-purple-700 scale-100' : 'opacity-0 pointer-events-none scale-90'}`}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
