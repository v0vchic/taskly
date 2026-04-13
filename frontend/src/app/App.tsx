'use client'

import type { AuthUser } from '@/shared/types'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/features/sidebar'
import { BoardCanvas, BoardHeader } from '@/widgets/board'
import { LoginForm } from '../features/login-form'
import { useAppState } from './store'

const SESSION_KEY = 'taskly_session'

function saveSession(user: AuthUser) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
  catch {}
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw)
      return null
    return JSON.parse(raw) as AuthUser
  }
  catch {
    return null
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  }
  catch {}
}

export const App = () => {
  // null = not yet checked, AuthUser = logged in
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessionChecked, setSessionChecked] = useState(false)

  // Restore session on first render
  useEffect(() => {
    const saved = loadSession()
    if (saved)
      setUser(saved)
    setSessionChecked(true)
  }, [])

  const handleLogin = (u: AuthUser) => {
    setUser(u)
    saveSession(u)
  }

  const handleLogout = () => {
    setUser(null)
    clearSession()
  }

  const {
    state,
    loading,
    error,
    activeProject,
    setActiveProjectId,
    updateActiveProject,
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
  } = useAppState(user)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Don't render anything until we've checked localStorage
  // (prevents flash of login screen on refresh)
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1e1b4b' }}>
        <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm onSuccess={handleLogin} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1e1b4b' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-white/50 text-sm">Loading projects…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1e1b4b' }}>
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">{error}</p>
          <button
            onClick={handleLogout}
            className="text-white/50 text-sm hover:text-white transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  if (!activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1e1b4b' }}>
        <p className="text-white/50 text-sm">No projects found.</p>
      </div>
    )
  }

  const bgGradient = `linear-gradient(135deg, ${activeProject.color}bb 0%, ${activeProject.color}44 50%, #1e1b4b 100%)`
  const handleToggleSidebar = () => setSidebarCollapsed(v => !v)

  return (
    <div className="flex h-screen overflow-hidden">
      {!sidebarCollapsed && (
        <div className="sidebar-overlay md:hidden" onClick={handleToggleSidebar} />
      )}

      <Sidebar
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        collapsed={sidebarCollapsed}
        role={user.role}
        onSelectProject={(id) => {
          setActiveProjectId(id)
          if (window.innerWidth < 768)
            setSidebarCollapsed(true)
        }}
        onAddProject={addProject}
        onRenameProject={renameProject}
        onDeleteProject={deleteProject}
        onToggleCollapse={handleToggleSidebar}
      />

      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ background: bgGradient }}
      >
        <BoardHeader
          project={activeProject}
          sidebarCollapsed={sidebarCollapsed}
          role={user.role}
          userEmail={user.email}
          onToggleSidebar={handleToggleSidebar}
          onRename={title => renameProject(activeProject.id, title)}
          onLogout={handleLogout}
        />

        <BoardCanvas
          project={activeProject}
          role={user.role}
          currentUser={user}
          onAddColumn={addColumn}
          onRenameColumn={renameColumn}
          onDeleteColumn={deleteColumn}
          onAddCard={addCard}
          onUpdateCard={updateCard}
          onDeleteCard={deleteCard}
          onMoveCard={moveCard}
          onUpdateProject={updateActiveProject}
        />
      </div>
    </div>
  )
}
