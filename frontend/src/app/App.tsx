'use client'

import type { AuthUser } from '@/shared/types'
import { useState } from 'react'
import { Sidebar } from '@/features/sidebar'
import { BoardCanvas, BoardHeader } from '@/widgets/board'
import { LoginForm } from '../features/login-form'
import { useAppState } from './store'

export const App = () => {
  const [user, setUser] = useState<AuthUser | null>(null)

  const {
    state,
    activeProject,
    setActiveProjectId,
    updateActiveProject,
    addProject,
    renameProject,
    deleteProject,
  } = useAppState()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (!user) {
    return <LoginForm onSuccess={setUser} />
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
          token={user.token}
          onUpdateProject={updateActiveProject}
        />
      </div>
    </div>
  )
}
