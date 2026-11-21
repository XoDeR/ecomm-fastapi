import { Outlet, ScrollRestoration } from 'react-router'

import { Header } from '@/components/Header'
import { Toaster } from '@/components/ui/sonner'

const YEAR = new Date().getFullYear()

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {YEAR} Ecomm.
      </footer>
      <Toaster position="top-right" />
      <ScrollRestoration />
    </div>
  )
}
