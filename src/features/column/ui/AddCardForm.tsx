'use client'

import { Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface AddCardFormProps {
  onAdd: (title: string) => void
}

export const AddCardForm = ({ onAdd }: AddCardFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen)
      textareaRef.current?.focus()
  }, [isOpen])

  const submit = () => {
    if (value.trim()) {
      onAdd(value.trim())
      setValue('')
      setIsOpen(false)
    }
  }

  const cancel = () => {
    setValue('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700
          hover:bg-slate-200 rounded-xl px-3 py-2 transition-all group"
      >
        <Plus className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
        Add a card
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
          if (e.key === 'Escape')
            cancel()
        }}
        placeholder="Card title..."
        rows={2}
        className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-xl
          px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-300 resize-none shadow-sm placeholder-slate-400"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={submit}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-1.5 rounded-lg transition-colors"
        >
          Add card
        </button>
        <button
          onClick={cancel}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
