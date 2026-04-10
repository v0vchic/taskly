import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Project } from './project.entity'
import { Card } from '../tasks/card.entity'

@Entity('board_column')
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ default: 0 })
  position: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => Project, (project) => project.columns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project

  @OneToMany(() => Card, (card) => card.column, { cascade: true, eager: false })
  cards: Card[]
}
