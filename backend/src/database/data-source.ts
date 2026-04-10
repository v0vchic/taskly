import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../users/user.entity'
import { Project } from '../projects/project.entity'
import { BoardColumn } from '../projects/board-column.entity'
import { Card } from '../tasks/card.entity'
import { CardLabel } from '../tasks/card-label.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Project, BoardColumn, Card, CardLabel],
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  logging: false,
})
