'use client'

import type { Project } from '@/shared/types'
import { API_BASE } from '@/shared/constants'

export async function fetchProjects(token: string): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok)
    throw new Error('Failed to load projects')
  return res.json()
}

export async function apiCreateProject(token: string, title: string, color: string, ownerId: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title, color, ownerId }),
  })
  if (!res.ok)
    throw new Error('Failed to create project')
  return res.json()
}

export async function apiRenameProject(token: string, id: string, title: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}/rename`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title }),
  })
  if (!res.ok)
    throw new Error('Failed to rename project')
  return res.json()
}

export async function apiDeleteProject(token: string, id: string): Promise<void> {
  await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function apiAddColumn(token: string, projectId: string, title: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/columns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title }),
  })
  if (!res.ok)
    throw new Error('Failed to add column')
  return res.json()
}

export async function apiRenameColumn(token: string, projectId: string, colId: string, title: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/columns/${colId}/rename`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title }),
  })
  if (!res.ok)
    throw new Error('Failed to rename column')
  return res.json()
}

export async function apiDeleteColumn(token: string, projectId: string, colId: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/columns/${colId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok)
    throw new Error('Failed to delete column')
  return res.json()
}

export async function apiAddCard(token: string, projectId: string, colId: string, title: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/columns/${colId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title }),
  })
  if (!res.ok)
    throw new Error('Failed to add card')
  return res.json()
}

export async function apiUpdateCard(
  token: string,
  projectId: string,
  cardId: string,
  data: {
    title?: string
    description?: string
    dueDate?: string
    labels?: { id: string, text: string, color: string }[]
    assigneeId?: string | null
  },
): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/cards/${cardId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok)
    throw new Error('Failed to update card')
  return res.json()
}

export async function apiDeleteCard(token: string, projectId: string, cardId: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/cards/${cardId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok)
    throw new Error('Failed to delete card')
  return res.json()
}

export async function apiMoveCard(
  token: string,
  projectId: string,
  cardId: string,
  targetColumnId: string,
  position: number,
): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/cards/${cardId}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ targetColumnId, position }),
  })
  if (!res.ok)
    throw new Error('Failed to move card')
  return res.json()
}
