'use client'

import type { Project } from '@/shared/types'
import Image from 'next/image'
import { AddProjectForm } from '@/features/sidebar'
import { ProjectItem } from './ProjectItem'

interface SidebarProps {
  projects: Project[]
  activeProjectId: string
  collapsed: boolean
  onSelectProject: (id: string) => void
  onAddProject: (title: string, color: string) => void
  onRenameProject: (id: string, title: string) => void
  onDeleteProject: (id: string) => void
  onToggleCollapse: () => void
}

export const Sidebar = ({
  projects,
  activeProjectId,
  collapsed,
  onSelectProject,
  onAddProject,
  onRenameProject,
  onDeleteProject,
}: SidebarProps) => {
  return (
    <aside
      className={`sidebar-mobile relative flex flex-col h-screen flex-shrink-0 select-none
        transition-[width,transform] duration-300 overflow-hidden
        ${collapsed ? 'collapsed' : 'open'}`}
      style={{
        /* Desktop: shrink width. Mobile: handled via CSS classes */
        width: collapsed ? '0px' : '220px',
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(16px)',
        borderRight: collapsed ? 'none' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Logo row */}
      <div className="flex items-center gap-3 px-3.5 py-4 border-b border-white/10 flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Taskly Logo"
          width={32}
          height={32}
          className="w-8 h-8 rounded-xl flex-shrink-0 object-contain brightness-0 invert"
        />
        <span className="text-2xl font-semibold text-white tracking-tight whitespace-nowrap overflow-hidden">
          Taskly
        </span>
      </div>

      {/* Projects */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pb-2 whitespace-nowrap">
          Projects
        </p>
        {projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            isActive={project.id === activeProjectId}
            canDelete={projects.length > 1}
            onSelect={() => onSelectProject(project.id)}
            onRename={title => onRenameProject(project.id, title)}
            onDelete={() => onDeleteProject(project.id)}
          />
        ))}
      </div>

      {/* Add project */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3 flex-shrink-0">
        <AddProjectForm onAdd={onAddProject} />
      </div>
    </aside>
  )
}
