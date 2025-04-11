'use client';

import { useState } from 'react';

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  roomName: string;
  capacity: number;
  startTime: Date;
}

interface BookingInfoProps {
  selectedSlots: TimeSlot[];
  onBackToBooking: () => void;
  onBookingConfirmed: () => void;  
}

export function BookingInfoPage({ selectedSlots, onBackToBooking, onBookingConfirmed }: BookingInfoProps) {
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onBookingConfirmed();
      setShowModal(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 relative h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-4 md:text-center sm:text-left">Vem bokar?</h2>
        <h3 className="text-lg font-semibold mb-2 md:text-center sm:text-left">Förnamn och efternamn</h3>
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Skriv ditt fullständiga namn här"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <button type="submit" className="bg-black text-white p-2 w-full rounded">
            Boka
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Dina rum är bokade</h3>
            <div className="text-3xl mb-4">🎉</div>
            <button
              onClick={onBackToBooking}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Tillbaka till bokning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
