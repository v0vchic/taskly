'use client'

import type { Card } from '@/shared/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AlignLeft, Calendar, Pencil } from 'lucide-react'

interface CardItemProps {
  card: Card
  onEdit: (card: Card) => void
}

function getInitials(email: string): string {
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

function getAvatarColor(email: string): string {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']
  let hash = 0
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export const CardItem = ({ card, onEdit }: CardItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging }
    = useSortable({ id: card.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm
        cursor-grab active:cursor-grabbing transition-all duration-150
        ${isDragging ? 'opacity-40 shadow-xl scale-105 rotate-1' : 'hover:border-slate-300 hover:shadow-md'}`}
      {...attributes}
      {...listeners}
    >
      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {card.labels.map(label => (
            <span
              key={label.id}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm font-medium text-slate-800 leading-snug">{card.title}</p>

      {/* Footer row: icons + assignee avatar */}
      {(card.description || card.dueDate || card.assigneeEmail) && (
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-3">
            {card.description && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <AlignLeft className="w-3 h-3" />
              </span>
            )}
            {card.dueDate && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                {card.dueDate}
              </span>
            )}
          </div>

          {/* Assignee avatar */}
          {card.assigneeEmail && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: getAvatarColor(card.assigneeEmail) }}
              title={card.assigneeEmail}
            >
              {getInitials(card.assigneeEmail)}
            </div>
          )}
        </div>
      )}

      {/* Edit button */}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(card) }}
        onPointerDown={e => e.stopPropagation()}
        className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100
          p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  )
}
