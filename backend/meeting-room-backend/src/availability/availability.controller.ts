import { Controller, Get, Query, Post, Body } from '@nestjs/common';
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

  @Post('/book')
  async bookRoom(@Body() body: { availabilityId: number }) {
    try {
      const bookedSlot = await this.availabilityService.bookRoom(body.availabilityId);
      return { message: 'Room successfully booked', bookedSlot };
    } catch (error) {
      return { message: 'Booking failed', error: error.message };
    }
  }
}
