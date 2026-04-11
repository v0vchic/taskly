'use client'

import type { AppState, AuthUser, Project } from '@/shared/types'
import { useCallback, useEffect, useState } from 'react'
import {
  apiAddCard,
  apiAddColumn,
  apiCreateProject,
  apiDeleteCard,
  apiDeleteColumn,
  apiDeleteProject,
  apiMoveCard,
  apiRenameColumn,
  apiRenameProject,
  apiUpdateCard,
  fetchProjects,
} from '@/shared/api/projects'

const EMPTY_STATE: AppState = { projects: [], activeProjectId: '' }

export const useAppState = (user: AuthUser | null) => {
  const [state, setState] = useState<AppState>(EMPTY_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load projects from API on login
  useEffect(() => {
    if (!user) { setState(EMPTY_STATE); return }
    setLoading(true)
    setError(null)
    fetchProjects(user.token)
      .then((projects) => {
        setState({
          projects,
          activeProjectId: projects[0]?.id ?? '',
        })
      })
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [user])

  const activeProject = state.projects.find(p => p.id === state.activeProjectId) ?? state.projects[0]

  const setActiveProjectId = (id: string) =>
    setState(prev => ({ ...prev, activeProjectId: id }))

  // Replace the full project in state with a fresh one returned from API
  const syncProject = useCallback((updated: Project) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === updated.id ? updated : p),
      activeProjectId: prev.activeProjectId || updated.id,
    }))
  }, [])

  // Optimistic updater (for drag-and-drop where we don't await API)
  const updateActiveProject = useCallback((updater: (p: Project) => Project) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === prev.activeProjectId ? updater(p) : p,
      ),
    }))
  }, [])

  const addProject = async (title: string, color: string) => {
    if (!user)
      return
    const created = await apiCreateProject(user.token, title, color, user.id)
    setState(prev => ({
      projects: [...prev.projects, created],
      activeProjectId: created.id,
    }))
  }

  const renameProject = async (id: string, title: string) => {
    if (!user)
      return
    const updated = await apiRenameProject(user.token, id, title)
    syncProject(updated)
  }

  const deleteProject = async (id: string) => {
    if (!user)
      return
    await apiDeleteProject(user.token, id)
    setState((prev) => {
      const remaining = prev.projects.filter(p => p.id !== id)
      return {
        projects: remaining,
        activeProjectId: prev.activeProjectId === id ? (remaining[0]?.id ?? '') : prev.activeProjectId,
      }
    })
  }

  // Column ops
  const addColumn = async (projectId: string, title: string) => {
    if (!user)
      return
    const updated = await apiAddColumn(user.token, projectId, title)
    syncProject(updated)
  }

  const renameColumn = async (projectId: string, colId: string, title: string) => {
    if (!user)
      return
    const updated = await apiRenameColumn(user.token, projectId, colId, title)
    syncProject(updated)
  }

  const deleteColumn = async (projectId: string, colId: string) => {
    if (!user)
      return
    const updated = await apiDeleteColumn(user.token, projectId, colId)
    syncProject(updated)
  }

  // Card ops
  const addCard = async (projectId: string, colId: string, title: string) => {
    if (!user)
      return
    const updated = await apiAddCard(user.token, projectId, colId, title)
    syncProject(updated)
  }

  const updateCard = async (
    projectId: string,
    cardId: string,
    data: Parameters<typeof apiUpdateCard>[3],
  ) => {
    if (!user)
      return
    const updated = await apiUpdateCard(user.token, projectId, cardId, data)
    syncProject(updated)
  }

  const deleteCard = async (projectId: string, cardId: string) => {
    if (!user)
      return
    const updated = await apiDeleteCard(user.token, projectId, cardId)
    syncProject(updated)
  }

  const moveCard = async (
    projectId: string,
    cardId: string,
    targetColumnId: string,
    position: number,
  ) => {
    if (!user)
      return
    const updated = await apiMoveCard(user.token, projectId, cardId, targetColumnId, position)
    syncProject(updated)
  }

  return {
    state,
    loading,
    error,
    activeProject,
    setActiveProjectId,
    updateActiveProject,
    syncProject,
    addProject,
    renameProject,
    deleteProject,
    addColumn,
    renameColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  }
}
