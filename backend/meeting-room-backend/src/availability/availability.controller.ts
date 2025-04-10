// src/availability/availability.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(
    @Query('rooms') roomIds: string,
    @Query('from') from: string,
  ) {
    const roomIdArray = roomIds.split(',').map(id => +id);
    const fromDate = new Date(from);
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 3);

    return this.availabilityService.findAvailability(roomIdArray, fromDate, toDate);
  }
}
