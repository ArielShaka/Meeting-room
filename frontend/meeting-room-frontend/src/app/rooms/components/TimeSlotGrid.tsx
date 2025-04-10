import { useState } from 'react';
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
}

export function TimeSlotGrid({ slots, selectedSlots, onSelectSlot }: Props) {
  const groupedByDate: Record<string, TimeSlot[]> = {};

  slots.forEach((slot) => {
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
    if (!slot.available) return;
  
    const currentlySelected = selectedSlots[slot.roomName];
    const isSelected = currentlySelected && isSameSlot(currentlySelected, slot);
  
    onSelectSlot?.(slot.roomName, isSelected ? null : slot);
  };
  

  return (
    <div className="overflow-auto h-[400px]">
      <div className="grid grid-cols-3 gap-4 max-w-full mx-auto">
        {Object.keys(groupedByDate).map((date) => (
          <div key={date} className="flex flex-col border rounded-md overflow-hidden">
            <div className="bg-gray-100 p-2 text-center font-semibold text-sm">
              {format(new Date(date), 'd MMMM', { locale: sv })}
            </div>

            <div className="flex-1 divide-y">
              {groupedByDate[date].map((slot, idx) => {
                const isSelected = selectedSlots[slot.roomName] && isSameSlot(selectedSlots[slot.roomName]!, slot);
                return (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => handleClick(slot)}
                    className={`w-full p-2 text-left transition-colors duration-200 ${
                      slot.available
                        ? isSelected
                          ? 'bg-green-800 text-white'
                          : 'bg-white hover:bg-green-100'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-semibold text-sm">
                      {slot.roomName} ({slot.capacity})
                    </div>
                    <div className="text-xs">{slot.time}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

