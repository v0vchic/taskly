'use client'

import { Check, MoreHorizontal, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ColumnHeaderProps {
  title: string
  cardCount: number
  onRename: (newTitle: string) => void
  onDelete: () => void
}

export const ColumnHeader = ({ title, cardCount, onRename, onDelete }: ColumnHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(title)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync value when title prop changes (e.g., external rename)
  useEffect(() => { setValue(title) }, [title])

  useEffect(() => {
    if (isEditing)
      inputRef.current?.focus()
  }, [isEditing])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const confirm = () => {
    if (value.trim())
      onRename(value.trim())
    else setValue(title)
    setIsEditing(false)
  }

  const cancel = () => {
    setValue(title)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-2 px-3.5 pt-3.5 pb-2.5">
      {/* Title area — fixed height so layout never shifts */}
      <div className="flex-1 min-w-0" style={{ height: '28px' }}>
        {isEditing
          ? (
              <div className="flex items-center gap-1 h-full">
                <input
                  ref={inputRef}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      confirm()
                    if (e.key === 'Escape')
                      cancel()
                  }}
                  onBlur={confirm}
                  className="flex-1 min-w-0 text-sm font-bold text-slate-700 bg-white border border-indigo-300
                rounded-lg px-2 h-full outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button onMouseDown={(e) => { e.preventDefault(); confirm() }} className="text-green-500 hover:text-green-600 flex-shrink-0">
                  <Check className="w-4 h-4" />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); cancel() }} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          : (
              <div
                className="flex items-center gap-2 h-full cursor-pointer group/title"
                onDoubleClick={() => setIsEditing(true)}
              >
                <h3 className="text-sm font-bold text-slate-700 truncate group-hover/title:text-indigo-600 transition-colors">
                  {title}
                </h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-200 rounded-full px-2 py-0.5 flex-shrink-0">
                  {cardCount}
                </span>
              </div>
            )}
      </div>

      {/* Menu */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={() => setShowMenu(v => !v)}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 min-w-40">
            <button
              onClick={() => { setIsEditing(true); setShowMenu(false) }}
              className="w-full text-left px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Rename
            </button>
            <button
              onClick={() => { onDelete(); setShowMenu(false) }}
              className="w-full text-left px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete column
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
