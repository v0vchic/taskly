import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Card } from './card.entity'

@Entity('card_label')
export class CardLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  text: string

  @Column()
  color: string

  @ManyToOne(() => Card, (card) => card.labels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card
}
