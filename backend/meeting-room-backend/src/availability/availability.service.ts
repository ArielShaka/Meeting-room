// src/availability/availability.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Availability } from './availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

// availability.service.ts
async findAvailability(roomIds: number[], from: Date, to: Date) {
  const allWeekdays: Date[] = [];

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const day = new Date(d);
    if (day.getDay() !== 0 && day.getDay() !== 6) { // Skip weekends
      allWeekdays.push(new Date(day));
    }
  }

  const slots = await this.availabilityRepository.find({
    where: {
      room: { id: In(roomIds) },
      isBooked: false,
    },
    relations: ['room'],
  });

  // Expand each time slot into a DateTime based on each weekday
  const expandedSlots = [];

  for (const slot of slots) {
    for (const date of allWeekdays) {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);

      const fullStart = new Date(date);
      fullStart.setHours(startHour, startMinute, 0, 0);

      const fullEnd = new Date(date);
      fullEnd.setHours(endHour, endMinute, 0, 0);

      expandedSlots.push({
        ...slot,
        startTime: fullStart,
        endTime: fullEnd,
      });
    }
  }

  return expandedSlots;
}

}
