'use client'

import type { CardComment } from '@/shared/types'
import { useCallback, useEffect, useState } from 'react'
import { API_BASE } from '@/shared/constants'

export function useComments(cardId: string, token: string) {
  const [comments, setComments] = useState<CardComment[]>([])
  const [loading, setLoading] = useState(true)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/cards/${cardId}/comments`, { headers })
      if (res.ok)
        setComments(await res.json())
    }
    finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, token])

  useEffect(() => { load() }, [load])

  const addComment = async (text: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/cards/${cardId}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text }),
    })
    if (res.ok) {
      const created: CardComment = await res.json()
      setComments(prev => [...prev, created])
    }
  }

  const editComment = async (commentId: string, text: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/cards/${cardId}/comments/${commentId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ text }),
    })
    if (res.ok) {
      const updated: CardComment = await res.json()
      setComments(prev => prev.map(c => c.id === commentId ? updated : c))
    }
  }

  const deleteComment = async (commentId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/cards/${cardId}/comments/${commentId}`, {
      method: 'DELETE',
      headers,
    })
    if (res.ok)
      setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return { comments, loading, addComment, editComment, deleteComment }
}
