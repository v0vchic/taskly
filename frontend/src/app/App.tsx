'use client'

import type { AuthUser } from '@/shared/types'
import { useState } from 'react'
import { LoginForm } from '@/features/login-form'
import { Sidebar } from '@/features/sidebar'
import { BoardCanvas, BoardHeader } from '@/widgets/board'
import { useAppState } from './store'

export const App = () => {
  const [user, setUser] = useState<AuthUser | null>(null)

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

  if (!user) {
    return <LoginForm onSuccess={setUser} />
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
            onClick={() => setUser(null)}
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
          onLogout={() => setUser(null)}
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
