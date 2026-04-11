export interface CardLabel {
  id: string
  text: string
  color: string
}

export interface Card {
  id: string
  title: string
  description?: string
  labels?: CardLabel[]
  dueDate?: string
  columnId: string
  assigneeId?: string
  assigneeEmail?: string
}

export interface Column {
  id: string
  title: string
  cardIds: string[]
}

export interface Project {
  id: string
  title: string
  color: string
  columns: Column[]
  cards: Record<string, Card>
}

export interface AppState {
  projects: Project[]
  activeProjectId: string
}

export type UserRole = 'manager' | 'developer'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  token: string
}

export interface AppUser {
  id: string
  email: string
  role: UserRole
}
