import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../rooms/room.entity';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.id)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column()
  @Column('time', { name: 'start_time' })
  startTime: string;

  @Column()
  @Column('time', { name: 'end_time' })
  endTime: string; 

  @Column({ default: false })
  @Column({ name: 'is_booked' })
  isBooked: boolean;
}
