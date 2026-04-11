'use client'

import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { AppUser, AuthUser, Card, Project, UserRole } from '@/shared/types'
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useState } from 'react'
import { CardItem } from '@/entities/card'
import { CardModal } from '@/features/card-modal'
import { ColumnContainer } from '@/features/column'
import { API_BASE } from '@/shared/constants'
import { AddColumnButton } from '@/widgets/board'

interface BoardCanvasProps {
  project: Project
  role: UserRole
  currentUser: AuthUser
  onAddColumn: (projectId: string, title: string) => Promise<void>
  onRenameColumn: (projectId: string, colId: string, title: string) => Promise<void>
  onDeleteColumn: (projectId: string, colId: string) => Promise<void>
  onAddCard: (projectId: string, colId: string, title: string) => Promise<void>
  onUpdateCard: (projectId: string, cardId: string, data: any) => Promise<void>
  onDeleteCard: (projectId: string, cardId: string) => Promise<void>
  onMoveCard: (projectId: string, cardId: string, targetColId: string, position: number) => Promise<void>
  onUpdateProject: (updater: (p: Project) => Project) => void
}

export const BoardCanvas = ({
  project,
  role,
  currentUser,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  onUpdateProject,
}: BoardCanvasProps) => {
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [users, setUsers] = useState<AppUser[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  useEffect(() => {
    fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(setUsers)
      .catch(() => setUsers([]))
  }, [currentUser.token])

  const findColumn = useCallback(
    (cardId: string) => project.columns.find(col => col.cardIds.includes(cardId)),
    [project.columns],
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    const card = project.cards[active.id as string]
    if (card)
      setActiveCard(card)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over)
      return
    const activeId = active.id as string
    const overId = over.id as string
    const fromCol = findColumn(activeId)
    if (!fromCol)
      return
    const toCol = project.columns.find(c => c.id === overId) || findColumn(overId)
    if (!toCol || fromCol.id === toCol.id)
      return

    onUpdateProject(p => ({
      ...p,
      columns: p.columns.map((col) => {
        if (col.id === fromCol.id)
          return { ...col, cardIds: col.cardIds.filter(id => id !== activeId) }
        if (col.id === toCol.id) {
          const idx = col.cardIds.indexOf(overId)
          const ids = [...col.cardIds]
          idx >= 0 ? ids.splice(idx, 0, activeId) : ids.push(activeId)
          return { ...col, cardIds: ids }
        }
        return col
      }),
      cards: { ...p.cards, [activeId]: { ...p.cards[activeId], columnId: toCol.id } },
    }))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeId = active.id as string
    setActiveCard(null)

    if (!over)
      return
    const overId = over.id as string
    const col = findColumn(activeId)

    if (col) {
      const sameCol = findColumn(overId)?.id === col.id
      if (sameCol) {
        const oldIdx = col.cardIds.indexOf(activeId)
        const newIdx = col.cardIds.indexOf(overId)
        if (oldIdx !== newIdx) {
          onUpdateProject(p => ({
            ...p,
            columns: p.columns.map(c =>
              c.id === col.id ? { ...c, cardIds: arrayMove(c.cardIds, oldIdx, newIdx) } : c,
            ),
          }))
        }
      }
    }

    // Find final column & position after optimistic update and call API
    const finalCol = project.columns.find(c => c.cardIds.includes(activeId))
    if (finalCol) {
      const position = finalCol.cardIds.indexOf(activeId)
      onMoveCard(project.id, activeId, finalCol.id, Math.max(position, 0))
    }
  }

  const handleAddCard = (columnId: string, title: string) =>
    onAddCard(project.id, columnId, title)

  const handleSaveCard = (updated: Card) =>
    onUpdateCard(project.id, updated.id, {
      title: updated.title,
      description: updated.description,
      dueDate: updated.dueDate,
      labels: updated.labels,
      assigneeId: updated.assigneeId ?? null,
    })

  const handleDeleteCard = (cardId: string) =>
    onDeleteCard(project.id, cardId)

  const handleAddColumn = (title: string) =>
    onAddColumn(project.id, title)

  const handleDeleteColumn = (columnId: string) =>
    onDeleteColumn(project.id, columnId)

  const handleRenameColumn = (columnId: string, title: string) =>
    onRenameColumn(project.id, columnId, title)

  return (
    <>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="board-columns-wrapper flex gap-5 p-6 items-start h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {project.columns.map((column) => {
              const cards = column.cardIds.map(id => project.cards[id]).filter(Boolean) as Card[]
              return (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  cards={cards}
                  role={role}
                  onAddCard={handleAddCard}
                  onEditCard={setEditingCard}
                  onDeleteColumn={handleDeleteColumn}
                  onRenameColumn={handleRenameColumn}
                />
              )
            })}
            <DragOverlay>
              {activeCard && (
                <div className="rotate-2 scale-105 opacity-90 shadow-2xl">
                  <CardItem card={activeCard} onEdit={() => {}} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
          {role === 'manager' && <AddColumnButton onAdd={handleAddColumn} />}
        </div>
      </div>

      {editingCard && (
        <CardModal
          card={editingCard}
          users={users}
          role={role}
          currentUser={currentUser}
          onClose={() => setEditingCard(null)}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
        />
      )}
    </>
  )
}
