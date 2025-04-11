'use client';

import { useState } from 'react';

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface Props {
  rooms: Room[];
  selected: string[];
  onSelect: (selectedIds: string[]) => void;
}

export function RoomSelector({ rooms, selected, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleCheckboxChange = (id: string) => {
    onSelect(
      selected.includes(id)
        ? selected.filter((roomId) => roomId !== id)
        : [...selected, id]
    );
  };

  const clearSelection = () => onSelect([]);

  const getButtonLabel = () => {
    if (selected.length === 0) return 'Mötesrum';

    if (selected.length === 1) {
      const room = rooms.find((r) => r.id.toString() === selected[0]);
      return room ? room.name : 'Mötesrum';
    }

    return `${selected.length} valda rum`;
  };

  return (
    <div className="room-selector relative w-full max-w-[13rem]">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 border rounded bg-white text-black focus:outline-none flex items-center gap-2 w-full justify-between"
      >
        {getButtonLabel()}
        <span className="text-sm">▼</span>
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded mt-1 z-10 max-h-72 overflow-auto shadow-lg flex flex-col justify-between w-[18rem]">
          <ul className="max-h-52 overflow-auto">
            {rooms.map((room) => (
              <li key={room.id} className="hover:bg-gray-100">
                <label className="flex items-center justify-between px-4 py-2 cursor-pointer w-full">
                  <span className="text-sm">
                    {room.name} ({room.capacity})
                  </span>
                  <input
                    type="checkbox"
                    checked={selected.includes(room.id.toString())}
                    onChange={() => handleCheckboxChange(room.id.toString())}
                    className="ml-2"
                  />
                </label>
              </li>
            ))}
          </ul>

          <div className="flex justify-between px-4 py-2 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-black text-white px-4 py-2 rounded w-[48%] hover:bg-gray-800 text-sm"
            >
              Välj
            </button>
            <button
              onClick={clearSelection}
              className="bg-black text-white px-4 py-2 rounded w-[48%] hover:bg-gray-800 text-sm"
            >
              Avmarkera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
