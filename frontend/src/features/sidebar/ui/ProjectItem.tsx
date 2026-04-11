'use client'

import type { Project, UserRole } from '@/shared/types'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ProjectItemProps {
  project: Project
  isActive: boolean
  canDelete: boolean
  role: UserRole
  onSelect: () => void
  onRename: (title: string) => void
  onDelete: () => void
}

export const ProjectItem = ({
  project,
  isActive,
  canDelete,
  role,
  onSelect,
  onRename,
  onDelete,
}: ProjectItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(project.title)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isManager = role === 'manager'

  useEffect(() => {
    if (project.title !== value)
      setValue(project.title)
  }, [project.title, value])
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
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
    >
      {isEditing
        ? (
            <div className="flex items-center gap-1 px-1 py-1">
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
                className="flex-1 min-w-0 text-xs text-white bg-white/10 border border-white/25 rounded-lg px-2 py-1.5 outline-none focus:border-white/50"
              />
              <button onMouseDown={(e) => { e.preventDefault(); confirm() }} className="text-green-400 hover:text-green-300 flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onMouseDown={(e) => { e.preventDefault(); cancel() }} className="text-white/40 hover:text-white/70 flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        : (
            <button
              onClick={onSelect}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all duration-150"
              style={{ background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent' }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-150"
                style={{
                  backgroundColor: project.color,
                  boxShadow: isActive ? `0 0 0 3px ${project.color}40` : 'none',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                }}
              />
              <span
                className="flex-1 text-left text-[13px] font-medium truncate transition-colors"
                style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.55)' }}
              >
                {project.title}
              </span>
            </button>
          )}

      {/* Manager-only action buttons */}
      {isManager && !isEditing && hovered && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          <button
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); setIsEditing(true) }}
            className="p-1 rounded-md hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
          {canDelete && (
            <button
              onMouseDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (confirmDelete)
                  onDelete()
                else setConfirmDelete(true)
              }}
              className={`p-1 rounded-md transition-colors ${confirmDelete ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40' : 'hover:bg-white/10 text-white/30 hover:text-red-400'}`}
              title={confirmDelete ? 'Click again to confirm' : 'Delete project'}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
