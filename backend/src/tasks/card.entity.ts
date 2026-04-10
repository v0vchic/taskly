import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BoardColumn } from '../projects/board-column.entity'
import { CardLabel } from './card-label.entity'

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate: string | null

  @Column({ default: 0 })
  position: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => BoardColumn, (col) => col.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'column_id' })
  column: BoardColumn

  @OneToMany(() => CardLabel, (label) => label.card, { cascade: true, eager: true })
  labels: CardLabel[]
}
