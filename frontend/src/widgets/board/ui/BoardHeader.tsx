'use client'

import type { Project, UserRole } from '@/shared/types'
import { Check, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Pencil, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface BoardHeaderProps {
  project: Project
  sidebarCollapsed: boolean
  role: UserRole
  userEmail: string
  onToggleSidebar: () => void
  onRename: (title: string) => void
  onLogout: () => void
}

export const BoardHeader = ({
  project,
  sidebarCollapsed,
  role,
  userEmail,
  onToggleSidebar,
  onRename,
  onLogout,
}: BoardHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(project.title)
  const [isMobile, setIsMobile] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isManager = role === 'manager'

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (project.title !== value) { setValue(project.title); setIsEditing(false) }
  }, [project.id, project.title, value])

  useEffect(() => {
    if (isEditing)
      inputRef.current?.focus()
  }, [isEditing])

  const confirm = () => {
    const trimmed = value.trim()
    if (trimmed)
      onRename(trimmed)
    else setValue(project.title)
    setIsEditing(false)
  }
  const cancel = () => { setValue(project.title); setIsEditing(false) }

  return (
    <header
      className="flex items-center gap-3 px-4 flex-shrink-0"
      style={{
        height: '52px',
        background: 'rgba(0,0,0,0.15)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0"
        title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        {isMobile ? <Menu className="w-4 h-4" /> : sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>

      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />

      <div className="flex items-center gap-2 flex-1 min-w-0" style={{ height: '32px' }}>
        {isEditing && isManager
          ? (
              <>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      confirm(); if (e.key === 'Escape')
                      cancel()
                  }}
                  onBlur={confirm}
                  className="text-base font-bold text-white bg-white/10 border border-white/30 rounded-lg px-2.5 h-full outline-none focus:border-white/60 min-w-0 max-w-xs"
                />
                <button onMouseDown={(e) => { e.preventDefault(); confirm() }} className="text-green-400 hover:text-green-300 flex-shrink-0">
                  <Check className="w-4 h-4" />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); cancel() }} className="text-white/40 hover:text-white/70 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </>
            )
          : (
              <button
                onClick={() => isManager && setIsEditing(true)}
                className={`flex items-center gap-2 group h-full min-w-0 ${!isManager ? 'cursor-default' : ''}`}
              >
                <span className="text-base font-bold text-white tracking-tight truncate max-w-[160px] tablet:max-w-xs">
                  {project.title}
                </span>
                {isManager && (
                  <Pencil className="w-3.5 h-3.5 text-white/0 group-hover:text-white/50 transition-colors flex-shrink-0" />
                )}
              </button>
            )}
      </div>

      {/* Right side: role badge + user email + logout */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isManager ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isManager ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
          {isManager ? 'Manager' : 'Developer'}
        </div>
        <span className="hidden md:block text-xs text-white/40 truncate max-w-[140px]">{userEmail}</span>
        <button
          onClick={onLogout}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
