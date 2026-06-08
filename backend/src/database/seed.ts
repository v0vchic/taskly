import 'reflect-metadata'
import * as dotenv from 'dotenv'

dotenv.config({
  path: __dirname + '/../../.env',
})

import * as bcrypt from 'bcrypt'
import { AppDataSource } from './data-source'
import { User } from '../users/user.entity'
import { Project } from '../projects/project.entity'
import { BoardColumn } from '../projects/board-column.entity'
import { Card } from '../tasks/card.entity'
import { CardLabel } from '../tasks/card-label.entity'

async function seed() {
  await AppDataSource.initialize()
  console.log('Connected to DB, seeding...')

  const userRepo    = AppDataSource.getRepository(User)
  const projectRepo = AppDataSource.getRepository(Project)
  const columnRepo  = AppDataSource.getRepository(BoardColumn)
  const cardRepo    = AppDataSource.getRepository(Card)
  const labelRepo   = AppDataSource.getRepository(CardLabel)

  await AppDataSource.query(`
    TRUNCATE TABLE
      card_label,
      card,
      board_column,
      project,
      "user"
    RESTART IDENTITY CASCADE;
  `)

  // Users
  const managerHash = await bcrypt.hash('manager123', 10)
  const devHash     = await bcrypt.hash('dev123', 10)

  const manager = userRepo.create({ email: 'manager@taskly.com', password: managerHash, role: 'manager' })
  const dev1    = userRepo.create({ email: 'dev1@taskly.com',    password: devHash,     role: 'developer' })
  const dev2    = userRepo.create({ email: 'dev2@taskly.com',    password: devHash,     role: 'developer' })

  await userRepo.save([manager, dev1, dev2])

  // Projects
  const project1 = projectRepo.create({ title: 'Доска проекта',         color: '#6366f1', owner: manager })
  const project2 = projectRepo.create({ title: 'Маркетинговая кампания', color: '#f59e0b', owner: manager })
  const project3 = projectRepo.create({ title: 'Дизайн-система',         color: '#ec4899', owner: manager })

  await projectRepo.save([project1, project2, project3])

  // Columns
  const columns = await columnRepo.save([
    // project1 (без Бэклога)
    columnRepo.create({ title: 'В работе',     position: 0, project: project1 }),
    columnRepo.create({ title: 'На проверке',  position: 1, project: project1 }),
    columnRepo.create({ title: 'Готово',        position: 2, project: project1 }),

    // project2
    columnRepo.create({ title: 'Идеи',    position: 0, project: project2 }),
    columnRepo.create({ title: 'В работе', position: 1, project: project2 }),
    columnRepo.create({ title: 'Готово',   position: 2, project: project2 }),

    // project3
    columnRepo.create({ title: 'Запланировано', position: 0, project: project3 }),
    columnRepo.create({ title: 'В разработке',  position: 1, project: project3 }),
    columnRepo.create({ title: 'Выпущено',       position: 2, project: project3 }),
  ])

  const [col1, col2, col3] = columns

  // Cards project1
  const cards1 = await cardRepo.save([
    cardRepo.create({ title: 'Компоненты дизайн-системы', description: 'Библиотека переиспользуемых компонентов', position: 0, column: col1 }),
    cardRepo.create({ title: 'Интеграция с API',                                                                  position: 1, column: col1 }),
    cardRepo.create({ title: 'Аутентификация пользователей', description: 'Проверка безопасности OAuth2',         position: 0, column: col2 }),
    cardRepo.create({ title: 'Редизайн лендинга',                                                                 position: 0, column: col3 }),
    cardRepo.create({ title: 'Схема базы данных',                                                                 position: 1, column: col3 }),
  ])

  await labelRepo.save([
    labelRepo.create({ text: 'Дизайн',      color: '#ec4899', card: cards1[0] }),
    labelRepo.create({ text: 'Бэкенд',      color: '#8b5cf6', card: cards1[1] }),
    labelRepo.create({ text: 'Безопасность', color: '#ef4444', card: cards1[2] }),
    labelRepo.create({ text: 'Дизайн',      color: '#ec4899', card: cards1[3] }),
    labelRepo.create({ text: 'Бэкенд',      color: '#8b5cf6', card: cards1[4] }),
  ])

  // Cards project2
  const [, col4, col5, col6] = columns
  const cards2 = await cardRepo.save([
    cardRepo.create({ title: 'Стратегия соцсетей на Q2',            position: 0, column: col4 }),
    cardRepo.create({ title: 'Шаблон рассылки',                     position: 1, column: col4 }),
    cardRepo.create({ title: 'Мероприятие по запуску продукта', description: 'Планирование запуска в Q2', position: 0, column: col5 }),
    cardRepo.create({ title: 'Гайдлайны бренда v2',                 position: 0, column: col6 }),
  ])

  await labelRepo.save([
    labelRepo.create({ text: 'Соцсети',    color: '#f59e0b', card: cards2[0] }),
    labelRepo.create({ text: 'Контент',    color: '#10b981', card: cards2[1] }),
    labelRepo.create({ text: 'Мероприятие', color: '#6366f1', card: cards2[2] }),
    labelRepo.create({ text: 'Дизайн',     color: '#ec4899', card: cards2[3] }),
  ])

  // Cards project3
  const [,,,,,, col7, col8] = columns
  const cards3 = await cardRepo.save([
    cardRepo.create({ title: 'Система цветовых токенов',                                                          position: 0, column: col7 }),
    cardRepo.create({ title: 'Поддержка тёмной темы', description: 'Тёмные варианты для всех компонентов',       position: 1, column: col7 }),
    cardRepo.create({ title: 'Компонент Button',                                                                  position: 0, column: col8 }),
  ])

  await labelRepo.save([
    labelRepo.create({ text: 'Токены',    color: '#ec4899', card: cards3[0] }),
    labelRepo.create({ text: 'Тема',      color: '#8b5cf6', card: cards3[1] }),
    labelRepo.create({ text: 'Компонент', color: '#6366f1', card: cards3[2] }),
  ])

  console.log('Seed complete!')
  await AppDataSource.destroy()
}

seed().catch((e) => {
  console.error('SEED ERROR:', e)
  process.exit(1)
})