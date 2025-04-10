import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvailabilityService } from './availability/availability.service';
import { AvailabilityController } from './availability/availability.controller';
import { AvailabilityModule } from './availability/availability.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Arben.shalom20',
      database: 'meeting_rooms',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RoomsModule,
    AvailabilityModule,
  ],
  controllers: [AppController, AvailabilityController],
  providers: [AppService],
})
export class AppModule {}
