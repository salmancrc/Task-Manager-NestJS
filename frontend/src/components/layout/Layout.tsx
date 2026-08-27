import type { ReactNode } from 'react'
import { Header } from './Header'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-indigo-500/30">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  )
}
