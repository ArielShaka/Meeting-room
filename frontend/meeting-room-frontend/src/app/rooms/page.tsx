'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchRooms } from './services/roomService';
import { RoomSelector } from './components/RoomSelector';
import { DateNavigator } from './components/DateNavigator';
import { TimeSlotGrid } from './components/TimeSlotGrid';
import { BookingInfoPage } from './components/BookingInfo';
import { formatISO } from 'date-fns';
import axios from 'axios';

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  roomName: string;
  capacity: number;
  startTime: Date;
}

export default function BookingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, TimeSlot | null>>({});
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [bookedRooms, setBookedRooms] = useState<string[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState(false);

  const searchParams = useSearchParams();

  const getThreeConsecutiveDays = (start: Date): string[] =>
    Array.from({ length: 3 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date.toISOString().split('T')[0];
    });

  useEffect(() => {
    fetchRooms().then(setRooms);

    const roomsFromQuery = searchParams.get('rooms');
    if (roomsFromQuery) {
      setSelectedRooms(roomsFromQuery.split(','));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!rooms.length) return;

    const fetchAvailability = async () => {
      try {
        const roomIds = selectedRooms.length
          ? selectedRooms
          : rooms.map((room) => room.id.toString());

        const [from, to] = getThreeConsecutiveDays(startDate);
        const { data } = await axios.get('/api/availability', {
          params: {
            rooms: roomIds.join(','),
            from: formatISO(new Date(from)),
            to: formatISO(new Date(to)),
          },
        });

        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          setTimeSlots([]);
          return;
        }

        const mappedSlots: TimeSlot[] = data.map((slot: any) => {
          const start = new Date(slot.startTime);
          const end = new Date(slot.endTime);

          return {
            date: start.toISOString().split('T')[0],
            time: `${start.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} - ${end.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`,
            available: !slot.isBooked,
            roomName: slot.roomName,
            capacity: slot.capacity,
            startTime: start,
          };
        });

        setTimeSlots(mappedSlots);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setTimeSlots([]);
      }
    };

    fetchAvailability();
  }, [selectedRooms, startDate, rooms]);

  const moveDays = (date: Date, direction: 'forward' | 'backward') => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + (direction === 'forward' ? 3 : -3));
    return newDate;
  };

  const handleBookingConfirmation = async () => {
    try {
      const bookings = Object.values(selectedSlots)
        .filter(Boolean)
        .map((slot) => ({
          availabilityId: slot!.startTime.getTime(),
          roomName: slot!.roomName,
        }));

      if (bookings.length > 0) {
        await axios.post('/api/availability/book', {
          availabilityId: bookings[0].availabilityId,
        });

        const newlyBooked = bookings.map((b) => b.roomName);
        setBookedRooms((prev) => [...prev, ...newlyBooked]);

        setTimeSlots((prev) =>
          prev.map((slot) =>
            newlyBooked.includes(slot.roomName)
              ? { ...slot, available: false }
              : slot
          )
        );

        setConfirmedBooking(true);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {!showBookingInfo && (
        <h1 className="text-2xl font-bold mb-4">Välj en tid</h1>
      )}
      {!showBookingInfo ? (
        <>
          <div className="mb-4">
            <RoomSelector
              rooms={rooms}
              selected={selectedRooms}
              onSelect={setSelectedRooms}
            />
          </div>

          <DateNavigator
            startDate={startDate}
            onPrev={() => setStartDate((prev) => moveDays(prev, 'backward'))}
            onNext={() => setShowBookingInfo(true)}
          />

          <div className="flex-1 overflow-auto my-4">
            <TimeSlotGrid
              slots={timeSlots}
              visibleDates={getThreeConsecutiveDays(startDate)}
              selectedSlots={selectedSlots}
              bookedRooms={bookedRooms}
              onSelectSlot={(roomName, slot) =>
                setSelectedSlots((prev) => ({ ...prev, [roomName]: slot }))
              }
            />
          </div>

          <div className="sticky bottom-0 bg-white py-4">
            <button
              disabled={Object.values(selectedSlots).filter(Boolean).length === 0}
              onClick={() => setShowBookingInfo(true)}
              className="bg-black text-white p-2 w-full rounded disabled:opacity-50"
            >
              Nästa
            </button>
          </div>
        </>
      ) : (
        <BookingInfoPage
          selectedSlots={Object.values(selectedSlots).filter(Boolean) as TimeSlot[]}
          onBackToBooking={() => setShowBookingInfo(false)}
          onBookingConfirmed={handleBookingConfirmation}
        />
      )}
    </div>
  );
}
