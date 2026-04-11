'use client'

import type { CardComment } from '@/shared/types'
import { Check, MessageSquare, Pencil, Send, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface CommentsSectionProps {
  comments: CardComment[]
  loading: boolean
  currentUserId: string
  currentUserRole: 'manager' | 'developer'
  onAdd: (text: string) => Promise<void>
  onEdit: (id: string, text: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
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

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
  } ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
}

interface CommentItemProps {
  comment: CardComment
  canEdit: boolean
  canDelete: boolean
  onEdit: (id: string, text: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function CommentItem({ comment, canEdit, canDelete, onEdit, onDelete }: CommentItemProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const [busy, setBusy] = useState(false)

  const email = comment.authorEmail ?? 'Unknown'

  const handleSave = async () => {
    if (!editText.trim() || editText === comment.text) { setEditing(false); return }
    setBusy(true)
    await onEdit(comment.id, editText.trim())
    setBusy(false)
    setEditing(false)
  }

  const handleDelete = async () => {
    setBusy(true)
    await onDelete(comment.id)
    setBusy(false)
  }

  return (
    <div className="flex gap-2.5 group">
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
        style={{ backgroundColor: getAvatarColor(email) }}
      >
        {getInitials(email)}
      </div>

      <div className="flex-1 min-w-0">
        {/* Author + date */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-semibold text-slate-700">{email.split('@')[0]}</span>
          <span className="text-[10px] text-slate-400">{formatDate(comment.createdAt)}</span>
        </div>

        {editing ? (
          <div className="space-y-1.5">
            <textarea
              autoFocus
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
                if (e.key === 'Escape') { setEditing(false); setEditText(comment.text) }
              }}
              rows={2}
              className="w-full text-sm text-slate-700 border border-indigo-300 rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleSave}
                disabled={busy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                {' '}
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(comment.text) }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                {' '}
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words pr-14">
              {comment.text}
            </p>
            {/* Action buttons — visible on hover */}
            {(canEdit || canDelete) && (
              <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {canEdit && (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={busy}
                    className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function CommentsSection({
  comments,
  loading,
  currentUserId,
  currentUserRole,
  onAdd,
  onEdit,
  onDelete,
}: CommentsSectionProps) {
  const [newText, setNewText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    const trimmed = newText.trim()
    if (!trimmed)
      return
    setSubmitting(true)
    await onAdd(trimmed)
    setNewText('')
    setSubmitting(false)
  }

  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <MessageSquare className="w-3.5 h-3.5" />
        Comments
        {comments.length > 0 && (
          <span className="ml-1 bg-slate-200 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </label>

      {/* Comment list */}
      {loading
        ? (
            <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-indigo-400 animate-spin" />
              Loading comments…
            </div>
          )
        : comments.length > 0
          ? (
              <div className="space-y-3 mb-3">
                {comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    canEdit={comment.authorId === currentUserId}
                    canDelete={comment.authorId === currentUserId || currentUserRole === 'manager'}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )
          : (
              <p className="text-xs text-slate-400 mb-3 px-1">No comments yet. Be the first!</p>
            )}

      {/* New comment input */}
      <div className="flex gap-2 items-end">
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
          }}
          placeholder="Write a comment… (Enter to send)"
          rows={2}
          className="flex-1 text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-300 resize-none transition-shadow placeholder-slate-400"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || !newText.trim()}
          className="p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl transition-colors flex-shrink-0 self-end"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
