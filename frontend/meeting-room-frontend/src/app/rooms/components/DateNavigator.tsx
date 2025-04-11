'use client';

import { format, addDays } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Props {
  startDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function DateNavigator({ startDate, onPrev, onNext }: Props) {
  const formattedRange = `${format(startDate, 'd MMMM', { locale: sv })} - ${format(
    addDays(startDate, 2),
    'd MMMM',
    { locale: sv }
  )}`;

  return (
    <div className="flex items-center justify-between px-4 mb-4">
      <button
        onClick={onPrev}
        className="bg-white border w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        aria-label="Previous dates"
      >
        ←
      </button>

      <span className="text-lg font-semibold">{formattedRange}</span>

      <button
        onClick={onNext}
        className="bg-white border w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        aria-label="Next dates"
      >
        →
      </button>
    </div>
  );
}
