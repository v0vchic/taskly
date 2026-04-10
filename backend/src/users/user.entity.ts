import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Project } from '../projects/project.entity'

export type UserRole = 'manager' | 'developer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: ['manager', 'developer'], default: 'developer' })
  role: UserRole

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[]
}
