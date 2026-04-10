import 'reflect-metadata'
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

  const userRepo     = AppDataSource.getRepository(User)
  const projectRepo  = AppDataSource.getRepository(Project)
  const columnRepo   = AppDataSource.getRepository(BoardColumn)
  const cardRepo     = AppDataSource.getRepository(Card)
  const labelRepo    = AppDataSource.getRepository(CardLabel)

  // Clear in reverse order
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
  const project1 = projectRepo.create({ title: 'My Project Board',   color: '#6366f1', owner: manager })
  const project2 = projectRepo.create({ title: 'Marketing Campaign', color: '#f59e0b', owner: manager })
  const project3 = projectRepo.create({ title: 'Design System',      color: '#ec4899', owner: manager })
  await projectRepo.save([project1, project2, project3])

  // Columns for project1
  const col1 = columnRepo.create({ title: 'Backlog',      position: 0, project: project1 })
  const col2 = columnRepo.create({ title: 'In Progress',  position: 1, project: project1 })
  const col3 = columnRepo.create({ title: 'Review',       position: 2, project: project1 })
  const col4 = columnRepo.create({ title: 'Done',         position: 3, project: project1 })
  await columnRepo.save([col1, col2, col3, col4])

  // Columns for project2
  const colM1 = columnRepo.create({ title: 'Ideas',       position: 0, project: project2 })
  const colM2 = columnRepo.create({ title: 'In Progress', position: 1, project: project2 })
  const colM3 = columnRepo.create({ title: 'Done',        position: 2, project: project2 })
  await columnRepo.save([colM1, colM2, colM3])

  // Columns for project3
  const colD1 = columnRepo.create({ title: 'Planned',  position: 0, project: project3 })
  const colD2 = columnRepo.create({ title: 'Building', position: 1, project: project3 })
  const colD3 = columnRepo.create({ title: 'Shipped',  position: 2, project: project3 })
  await columnRepo.save([colD1, colD2, colD3])

  // Cards for project1
  const cards1 = await cardRepo.save([
    cardRepo.create({ title: 'Research competitors',  description: 'Analyze top 5 competitors',  position: 0, column: col1 }),
    cardRepo.create({ title: 'Define project scope',  position: 1, column: col1 }),
    cardRepo.create({ title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions',   position: 2, column: col1 }),
    cardRepo.create({ title: 'Design system components', description: 'Reusable component library', position: 0, column: col2 }),
    cardRepo.create({ title: 'API integration',       position: 1, column: col2 }),
    cardRepo.create({ title: 'User authentication flow', description: 'Review OAuth2 security',  position: 0, column: col3 }),
    cardRepo.create({ title: 'Landing page redesign', position: 0, column: col4 }),
    cardRepo.create({ title: 'Database schema',       position: 1, column: col4 }),
  ])

  // Labels
  await labelRepo.save([
    labelRepo.create({ text: 'Research', color: '#6366f1', card: cards1[0] }),
    labelRepo.create({ text: 'Planning', color: '#f59e0b', card: cards1[1] }),
    labelRepo.create({ text: 'DevOps',   color: '#10b981', card: cards1[2] }),
    labelRepo.create({ text: 'Design',   color: '#ec4899', card: cards1[3] }),
    labelRepo.create({ text: 'Backend',  color: '#8b5cf6', card: cards1[4] }),
    labelRepo.create({ text: 'Security', color: '#ef4444', card: cards1[5] }),
    labelRepo.create({ text: 'Design',   color: '#ec4899', card: cards1[6] }),
    labelRepo.create({ text: 'Backend',  color: '#8b5cf6', card: cards1[7] }),
  ])

  // Cards for project2
  const cardsM = await cardRepo.save([
    cardRepo.create({ title: 'Q2 social media strategy', position: 0, column: colM1 }),
    cardRepo.create({ title: 'Newsletter template',       position: 1, column: colM1 }),
    cardRepo.create({ title: 'Product launch event', description: 'Plan Q2 launch event', position: 0, column: colM2 }),
    cardRepo.create({ title: 'Brand guidelines v2',       position: 0, column: colM3 }),
  ])
  await labelRepo.save([
    labelRepo.create({ text: 'Social',  color: '#f59e0b', card: cardsM[0] }),
    labelRepo.create({ text: 'Content', color: '#10b981', card: cardsM[1] }),
    labelRepo.create({ text: 'Event',   color: '#6366f1', card: cardsM[2] }),
    labelRepo.create({ text: 'Design',  color: '#ec4899', card: cardsM[3] }),
  ])

  // Cards for project3
  const cardsD = await cardRepo.save([
    cardRepo.create({ title: 'Color token system',  position: 0, column: colD1 }),
    cardRepo.create({ title: 'Dark mode support', description: 'Dark variants for all components', position: 1, column: colD1 }),
    cardRepo.create({ title: 'Button component',    position: 0, column: colD2 }),
  ])
  await labelRepo.save([
    labelRepo.create({ text: 'Tokens',    color: '#ec4899', card: cardsD[0] }),
    labelRepo.create({ text: 'Theme',     color: '#8b5cf6', card: cardsD[1] }),
    labelRepo.create({ text: 'Component', color: '#6366f1', card: cardsD[2] }),
  ])

  console.log('Seed complete!')
  console.log('  manager@taskly.com / manager123  (role: manager)')
  console.log('  dev1@taskly.com    / dev123       (role: developer)')
  console.log('  dev2@taskly.com    / dev123       (role: developer)')
  await AppDataSource.destroy()
}

seed().catch(e => { console.error(e); process.exit(1) })
