import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Dog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  breed: string;

  @Column({ nullable: true })
  age: number;

  @Column({ default: true })
  isActive: boolean;
}
