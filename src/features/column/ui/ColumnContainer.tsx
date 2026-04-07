'use client'

import type { Card, Column } from '@/shared/types'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CardItem } from '@/entities/card'
import { AddCardForm, ColumnHeader } from '@/features/column'

interface ColumnContainerProps {
  column: Column
  cards: Card[]
  onAddCard: (columnId: string, title: string) => void
  onEditCard: (card: Card) => void
  onDeleteColumn: (columnId: string) => void
  onRenameColumn: (columnId: string, newTitle: string) => void
}

export const ColumnContainer = ({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteColumn,
  onRenameColumn,
}: ColumnContainerProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      <div
        className={`flex flex-col rounded-2xl transition-all duration-200 h-fit max-h-[calc(100vh-140px)]
          ${isOver ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}
        style={{ background: 'rgba(241,245,249,0.85)' }}
      >
        <ColumnHeader
          title={column.title}
          cardCount={cards.length}
          onRename={t => onRenameColumn(column.id, t)}
          onDelete={() => onDeleteColumn(column.id)}
        />

        {/* Cards list */}
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto px-3 pb-2 space-y-2 min-h-[8px]"
        >
          <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
            {cards.map(card => (
              <CardItem key={card.id} card={card} onEdit={onEditCard} />
            ))}
          </SortableContext>
        </div>

        {/* Add card */}
        <div className="px-3 pb-3">
          <AddCardForm onAdd={title => onAddCard(column.id, title)} />
        </div>
      </div>
    </div>
  )
}
