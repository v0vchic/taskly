'use client'

import { useState } from 'react'
import { Sidebar } from '@/features/sidebar'
import { BoardCanvas, BoardHeader } from '@/widgets/board'
import { useAppState } from './store'

export const App = () => {
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

  const bgGradient = `linear-gradient(135deg, ${activeProject.color}bb 0%, ${activeProject.color}44 50%, #1e1b4b 100%)`

  const handleToggleSidebar = () => setSidebarCollapsed(v => !v)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay backdrop */}
      {!sidebarCollapsed && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      <Sidebar
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        collapsed={sidebarCollapsed}
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
          onToggleSidebar={handleToggleSidebar}
          onRename={title => renameProject(activeProject.id, title)}
        />

        <BoardCanvas
          project={activeProject}
          onUpdateProject={updateActiveProject}
        />
      </div>
    </div>
  )
}
