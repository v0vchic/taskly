'use client'

import type { Lang, Translations } from './translations'
import { createContext, useContext, useState } from 'react'
import { t } from './translations'

interface LangContextValue {
  lang: Lang
  tr: Translations
  toggleLang: () => void
}

const LangContext = createContext<LangContextValue | null>(null)

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en')

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ru' : 'en'))
  }

  return (
    <LangContext.Provider
      value={{
        lang,
        tr: t[lang],
        toggleLang,
      }}
    >
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx)
    throw new Error('useLang must be used within LangProvider')
  return ctx
}
