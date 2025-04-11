'use client';

import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  roomName: string;
  capacity: number;
  startTime: Date;
}

interface Props {
  slots: TimeSlot[];
  selectedSlots: Record<string, TimeSlot | null>;
  onSelectSlot?: (roomName: string, slot: TimeSlot | null) => void;
  visibleDates: string[];
  bookedRooms: string[];  
}

export function TimeSlotGrid({ slots, selectedSlots, onSelectSlot, visibleDates, bookedRooms }: Props) {
  const groupedByDate: Record<string, TimeSlot[]> = {};
  const filteredSlots = slots.filter((slot) => !bookedRooms.includes(slot.roomName));

  filteredSlots.forEach((slot) => {
    if (!groupedByDate[slot.date]) {
      groupedByDate[slot.date] = [];
    }
    groupedByDate[slot.date].push(slot);
  });

  Object.values(groupedByDate).forEach((daySlots) =>
    daySlots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  );

  const isSameSlot = (a: TimeSlot, b: TimeSlot) =>
    a.startTime.getTime() === b.startTime.getTime() && a.roomName === b.roomName;

  const handleClick = (slot: TimeSlot) => {
    const isWeekend = slot.startTime.getDay() === 0 || slot.startTime.getDay() === 6;
    if (!slot.available || isWeekend) return;

    const currentlySelected = selectedSlots[slot.roomName];
    const isSelected = currentlySelected && isSameSlot(currentlySelected, slot);

    onSelectSlot?.(slot.roomName, isSelected ? null : slot);
  };

  return (
    <div className="overflow-auto h-full bg-white">
      <div className="grid grid-cols-3 border border-gray-300">
        {visibleDates.map((date, colIndex) => (
          <div
            key={date}
            className={`text-center font-semibold text-sm p-2 bg-white ${
              colIndex !== 0 ? 'border-l border-gray-300' : ''
            }`}
          >
            {format(new Date(date), 'd MMMM', { locale: sv })}
          </div>
        ))}
        <div className="col-span-3 border-t border-gray-300"></div>
        {Array.from({ length: Math.max(...visibleDates.map((date) => groupedByDate[date]?.length || 0)) }).map((_, rowIndex) =>
          visibleDates.map((date, colIndex) => {
            const daySlots = groupedByDate[date] || [];
            const slot = daySlots[rowIndex];

            if (!slot) {
              const day = new Date(date).getDay();
              return (
                <div
                  key={`${date}-${rowIndex}`}
                  className={`p-4 text-center text-sm text-gray-400 bg-white ${
                    colIndex !== 0 ? 'border-l border-gray-300' : ''
                  }`}
                >
                  {day === 0 || day === 6 ? 'Helg dag' : ''}
                </div>
              );
            }

            const isSelected =
              selectedSlots[slot.roomName] &&
              isSameSlot(selectedSlots[slot.roomName]!, slot);

            return (
              <div
                key={`${date}-${rowIndex}`}
                className={`p-2 bg-white ${
                  colIndex !== 0 ? 'border-l border-gray-300' : ''
                }`}
              >
                <button
                  disabled={!slot.available}
                  onClick={() => handleClick(slot)}
                  className={`w-full p-3 rounded border text-left transition-all duration-200 ${
                    slot.available
                      ? isSelected
                        ? 'bg-green-800 text-white border-green-800'
                        : 'bg-white hover:bg-green-50 border-green-500'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">
                    {slot.roomName} ({slot.capacity})
                  </div>
                  <div className="text-xs">{slot.time}</div>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
