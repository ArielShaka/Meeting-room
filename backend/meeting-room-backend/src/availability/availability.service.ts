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
    const weekdays = this.getWeekdaysInRange(from, to);
    const baseSlots = await this.getAvailableBaseSlots(roomIds);

    return this.expandSlots(baseSlots, weekdays);
  }

  private getWeekdaysInRange(from: Date, to: Date): Date[] {
    const dates: Date[] = [];
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        dates.push(new Date(day.getTime()));
      }
    }
    return dates;
  }

  private async getAvailableBaseSlots(roomIds: number[]) {
    return this.availabilityRepository.find({
      where: {
        room: { id: In(roomIds) },
        isBooked: false,
      },
      relations: ['room'],
    });
  }

  private expandSlots(baseSlots: Availability[], dates: Date[]) {
    return dates.flatMap(date =>
      baseSlots.map(slot => {
        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);

        const fullStart = new Date(date);
        fullStart.setHours(startHour, startMinute, 0, 0);

        const fullEnd = new Date(date);
        fullEnd.setHours(endHour, endMinute, 0, 0);

        return {
          roomName: slot.room.name,
          capacity: slot.room.capacity,
          date: date.toISOString().split('T')[0],
          time: `${slot.startTime}–${slot.endTime}`,
          startTime: fullStart,
          endTime: fullEnd,
          available: true,
        };
      })
    );
  }

  async bookRoom(availabilityId: number): Promise<Availability> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId },
      relations: ['room'],
    });

    if (!availability) throw new Error('Availability slot not found');
    if (availability.isBooked) throw new Error('Room is already booked');

    availability.isBooked = true;
    return this.availabilityRepository.save(availability);
  }
}

