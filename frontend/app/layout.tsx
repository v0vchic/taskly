import type { Metadata } from 'next'
import { LangProvider } from '@/shared/i18n'
import './globals.css'

export const metadata: Metadata = {
  title: 'Taskly',
  description: 'Project task board',
  icons: { icon: 'logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
