import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Card } from './card.entity'
import { User } from '../users/user.entity'

@Entity('card_comment')
export class CardComment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    text: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @ManyToOne(() => Card, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'card_id' })
    card: Card

    @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'author_id' })
    author: User | null
}