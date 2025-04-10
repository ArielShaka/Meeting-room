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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (id: string) => {
    const updatedSelected = selected.includes(id)
      ? selected.filter((roomId) => roomId !== id)
      : [...selected, id];
    onSelect(updatedSelected);
  };

  const handleApply = () => {
    setIsOpen(false); // just close the dropdown, the state is already applied
  };

  const handleClear = () => {
    onSelect([]);
  };

  const getButtonLabel = () => {
    if (selected.length === 0) {
      return 'Mötesrum';
    } else if (selected.length === 1) {
      const selectedRoom = rooms.find((room) => room.id.toString() === selected[0]);
      return selectedRoom ? selectedRoom.name : 'Mötesrum';
    } else {
      return `${selected.length} valda rum`;
    }
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
          <li
            key={room.id}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            <input
              type="checkbox"
              checked={selected.includes(room.id.toString())}
              onChange={() => handleCheckboxChange(room.id.toString())}
              className="mr-2"
            />
            {room.name} ({room.capacity})
          </li>
        ))}
      </ul>

      <div className="flex justify-between px-4 py-2 border-t border-gray-200">
        <button
          onClick={handleApply}
          className="bg-black text-white px-4 py-2 rounded w-[48%] hover:bg-gray-800 text-sm"
        >
          Välj
        </button>
        <button
          onClick={handleClear}
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
