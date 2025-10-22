import { BaseEntity } from 'src/common/entities/base.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  contentUrl: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  shareToken: string;

  @Column()
  @Index()
  courseId: string;

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
