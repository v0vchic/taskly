'use client'

import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { Card, Project, UserRole } from '@/shared/types'
import { closestCorners, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CardItem } from '@/entities/card'
import { CardModal } from '@/features/card-modal'
import { ColumnContainer } from '@/features/column'
import { AddColumnButton } from '@/widgets/board'

interface BoardCanvasProps {
  project: Project
  role: UserRole
  onUpdateProject: (updater: (p: Project) => Project) => void
}

export const BoardCanvas = ({ project, role, onUpdateProject }: BoardCanvasProps) => {
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [editingCard, setEditingCard] = useState<Card | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

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
    setActiveCard(null)
    if (!over)
      return
    const activeId = active.id as string
    const overId = over.id as string
    const col = findColumn(activeId)
    if (!col || findColumn(overId)?.id !== col.id)
      return
    const oldIdx = col.cardIds.indexOf(activeId)
    const newIdx = col.cardIds.indexOf(overId)
    if (oldIdx === newIdx)
      return
    onUpdateProject(p => ({
      ...p,
      columns: p.columns.map(c => c.id === col.id ? { ...c, cardIds: arrayMove(c.cardIds, oldIdx, newIdx) } : c),
    }))
  }

  const handleAddCard = (columnId: string, title: string) => {
    const id = uuidv4()
    onUpdateProject(p => ({
      ...p,
      columns: p.columns.map(c => c.id === columnId ? { ...c, cardIds: [...c.cardIds, id] } : c),
      cards: { ...p.cards, [id]: { id, title, columnId } },
    }))
  }

  const handleDeleteCard = (cardId: string) => {
    onUpdateProject((p) => {
      const cards = { ...p.cards }
      delete cards[cardId]
      return { ...p, columns: p.columns.map(c => ({ ...c, cardIds: c.cardIds.filter(id => id !== cardId) })), cards }
    })
  }

  const handleSaveCard = (updated: Card) =>
    onUpdateProject(p => ({ ...p, cards: { ...p.cards, [updated.id]: updated } }))

  const handleAddColumn = (title: string) => {
    const id = uuidv4()
    onUpdateProject(p => ({ ...p, columns: [...p.columns, { id, title, cardIds: [] }] }))
  }

  const handleDeleteColumn = (columnId: string) => {
    onUpdateProject((p) => {
      const col = p.columns.find(c => c.id === columnId)
      if (!col)
        return p
      const cards = { ...p.cards }
      col.cardIds.forEach(id => delete cards[id])
      return { ...p, columns: p.columns.filter(c => c.id !== columnId), cards }
    })
  }

  const handleRenameColumn = (columnId: string, title: string) =>
    onUpdateProject(p => ({ ...p, columns: p.columns.map(c => c.id === columnId ? { ...c, title } : c) }))

  return (
    <>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="board-columns-wrapper flex gap-5 p-6 items-start h-full">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
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
        <CardModal card={editingCard} onClose={() => setEditingCard(null)} onSave={handleSaveCard} onDelete={handleDeleteCard} />
      )}
    </>
  )
}
