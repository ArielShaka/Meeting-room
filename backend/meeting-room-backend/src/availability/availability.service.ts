import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Availability } from './availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>, 
  ) {}

  async findAvailability(roomIds: number[], from: Date, to: Date) {
    const allDates: Date[] = [];

    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d.getTime())); // clone the date
    }

    const baseSlots = await this.availabilityRepository.find({
      where: {
        room: { id: In(roomIds) },
        isBooked: false,
      },
      relations: ['room'],
    });

    const expandedSlots = [];

    for (const date of allDates) {
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
      
      if (isWeekend) continue;
      for (const slot of baseSlots) {
        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);

        const fullStart = new Date(date);
        fullStart.setHours(startHour, startMinute, 0, 0);

        const fullEnd = new Date(date);
        fullEnd.setHours(endHour, endMinute, 0, 0);

        expandedSlots.push({
          roomName: slot.room.name,
          capacity: slot.room.capacity,
          date: date.toISOString().split('T')[0], // 'YYYY-MM-DD'
          time: `${slot.startTime}–${slot.endTime}`,
          startTime: fullStart,
          endTime: fullEnd,
          available: true,
        });
      }
    }

    return expandedSlots;
  }


  async bookRoom(availabilityId: number): Promise<Availability> {
    const availability = await this.availabilityRepository.createQueryBuilder('availability')
      .leftJoinAndSelect('availability.room', 'room') 
      .where('availability.id = :availabilityId', { availabilityId })
      .getOne();

    if (!availability) {
      throw new Error('Availability slot not found');
    }
    if (availability.isBooked) {
      throw new Error('Room is already booked');
    }

    availability.isBooked = true;
    return this.availabilityRepository.save(availability);
  }
}
