'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchRooms } from './services/roomService';
import { RoomSelector } from './components/RoomSelector';
import { DateNavigator } from './components/DateNavigator';
import { TimeSlotGrid } from './components/TimeSlotGrid';
import { formatISO } from 'date-fns';
import axios from 'axios';
import { BookingInfoPage } from './components/BookingInfo';


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

  const router = useRouter(); 
  const searchParams = useSearchParams();


  useEffect(() => {
    fetchRooms().then(setRooms);

    const roomsFromQuery = searchParams.get('rooms');
    if (roomsFromQuery) {
      setSelectedRooms(roomsFromQuery.split(','));
    }
  }, [searchParams]);  

  useEffect(() => {
    if (rooms.length === 0) return; // ✅ Wait until rooms are fetched

    const fetchAvailability = async () => {
      try {
        const selectedRoomsParam = selectedRooms.length > 0
          ? selectedRooms.join(',')
          : rooms.map(r => r.id).join(',');

        const from = formatISO(startDate);
        const { data } = await axios.get(`/api/availability`, {
          params: { rooms: selectedRoomsParam, from },
        });

        if (Array.isArray(data)) {
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
              roomName: slot.room.name,
              capacity: slot.room.capacity,
              startTime: start,
            };
          });

          setTimeSlots(mappedSlots);
        } else {
          console.error('API response is not an array:', data);
          setTimeSlots([]);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        setTimeSlots([]);
      }
    };

    fetchAvailability(); // 🚀 Call the function here
  }, [selectedRooms, startDate, rooms]); // ✅ Watch for rooms
  
  const handlePrev = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 3);
    setStartDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 3);
    setStartDate(newDate);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {!showBookingInfo && (
        <h1 className="text-2xl font-bold mb-4">📅 Välj en tid</h1>
      )}

      {!showBookingInfo ? (
        <>
          <div className="mb-4">
            <RoomSelector rooms={rooms} selected={selectedRooms} onSelect={setSelectedRooms} />
          </div>
          <DateNavigator startDate={startDate} onPrev={handlePrev} onNext={handleNext} />
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <TimeSlotGrid
              slots={timeSlots}
              selectedSlots={selectedSlots}
              onSelectSlot={(roomName, slot) =>
                setSelectedSlots((prev) => ({ ...prev, [roomName]: slot }))
              }
            />
          </div>
          <div className="mt-4">
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
        onBackToBooking={() => {
          setShowBookingInfo(false);
        }}
      />      
      )}
    </div>
  );
  
}

